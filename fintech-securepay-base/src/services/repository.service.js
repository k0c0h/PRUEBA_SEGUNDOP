export class RepositoryService {

    constructor(usersDb, transactionsHistory) {
        this.usersDb = usersDb;
        this.transactionsHistory = transactionsHistory;
    }

    findAccount(accountId) {
        return this.usersDb.find(
            u => u.accountAlpha === accountId
        );
    }

    saveTransaction(transaction) {
        this.transactionsHistory.push(transaction);
    }

    getBalance(accountId) {

        const account = this.findAccount(accountId);

        if (!account) {
            throw new Error('Cuenta no encontrada');
        }

        return account;
    }
}

