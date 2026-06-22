
const transactionService = require('../services/transaction.monolith.service');
const Sentry = require('@sentry/node');
import { TransactionService } from '../services/transaction.service.js';
import { ValidationService } from '../services/validation.service.js';
import { RepositoryService } from '../services/repository.service.js';
import { NotificationService } from '../services/notification.service.js';
import { AccountService } from '../services/account.service.js';
import { transactionsHistory } from '../services/transaction.monolith.service.js';
import { usersDb } from '../services/transaction.monolith.service.js';

// Inyección de dependencias

const repository = new RepositoryService(
    usersDb,
    transactionsHistory
);

const validator = new ValidationService();

const notifier = new NotificationService();

const accountService = new AccountService();

const transactionService = new TransactionService(
    repository,
    validator,
    accountService,
    notifier
);


/**
 * Endpoint para ejecutar una transferencia bancaria (Beta).
 * POST /v1/transfer-beta/execute
 */
function executeTransfer(req, res) {
  try {

    // Simulación de fallo operacional
    if (req.body.simulateFailure === true) {
      throw new Error(
        'Conexión interrumpida con el Clúster de Datos SecurePay'
      );
    }

    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || amount === undefined) {
      return res.status(400).json({
        error: 'Petición incorrecta',
        message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
      });
    }

    const result = transactionService.executeTransfer(
      fromAccountId,
      toAccountId,
      Number(amount)
    );

    return res.status(200).json(result);

  } catch (error) {

    // Error operacional -> reportar a Sentry
    if (
      error.message ===
      'Conexión interrumpida con el Clúster de Datos SecurePay'
    ) {

      if (req.user?.sub) {
        Sentry.setTag('userId', req.user.sub);
      }

      Sentry.captureException(error);

      return res.status(500).json({
        error: 'Error operacional',
        message: error.message
      });
    }

    // Error lógico -> NO reportar a Sentry
    return res.status(400).json({
      error: 'Error en la transacción',
      message: error.message
    });
  }
}

export {
  executeTransfer
};