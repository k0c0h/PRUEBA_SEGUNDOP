export class ValidationService {

    validateTransfer(sender, receiver, amount) {

        if (!sender) {
            throw new Error('La cuenta origen no existe.');
        }

        if (!receiver) {
            throw new Error('La cuenta destino no existe.');
        }

        if (amount <= 0) {
            throw new Error('El monto debe ser mayor a cero.');
        }

        if (sender.balance < amount) {
            throw new Error('Saldo insuficiente.');
        }
    }
}

