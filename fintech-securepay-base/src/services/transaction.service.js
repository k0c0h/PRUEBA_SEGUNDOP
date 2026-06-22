export class TransactionService {

    constructor(
        repositoryService,
        validationService,
        accountService,
        notificationService
    ) {

        this.repository = repositoryService;
        this.validation = validationService;
        this.accountService = accountService;
        this.notification = notificationService;
    }

    executeTransfer(fromAccountId, toAccountId, amount) {

        const sender =
            this.repository.findAccount(fromAccountId);

        const receiver =
            this.repository.findAccount(toAccountId);

        this.validation.validateTransfer(
            sender,
            receiver,
            amount
        );

        this.accountService.transfer(
            sender,
            receiver,
            amount
        );

        const transaction = {
            transactionId:
                `TX-${Date.now()}`,

            from: fromAccountId,
            to: toAccountId,
            amount,
            status: 'COMPLETED',
            timestamp: new Date().toISOString()
        };

        this.repository.saveTransaction(
            transaction
        );

        this.notification.sendEmail(
            sender,
            amount
        );

        this.notification.sendEmail(
            receiver,
            amount,
            fromAccountId
        );

        return {
            success: true,
            transaction,
            balanceRestante: sender.balance
        };
    }

    getAccountBalance(accountId) {

        return this.repository.getBalance(accountId);
    }
}

