const transactionService = require('../services/transaction.monolith.service');
const Sentry = require('@sentry/node');

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

module.exports = {
  executeTransfer
};