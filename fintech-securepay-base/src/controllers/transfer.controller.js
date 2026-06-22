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
 * 
 * Espera un cuerpo JSON con: { fromAccountId, toAccountId, amount }
 */
function executeTransfer(req, res) {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || amount === undefined) {
      return res.status(400).json({
        error: 'Petición incorrecta',
        message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
      });
    }

    const result = transactionService.executeTransfer(fromAccountId, toAccountId, Number(amount));
    return res.status(200).json(result);
  } catch (error) {
    // Si la validación o deducción falla en el monolito, se maneja como error bad request.
    return res.status(400).json({
      error: 'Error en la transacción',
      message: error.message
    });
  }
}

export {
  executeTransfer
};
