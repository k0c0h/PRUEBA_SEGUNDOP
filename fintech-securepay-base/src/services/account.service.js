export class AccountService {
    transfer(sender, receiver, amount) {
        sender.balance -= amount;
        receiver.balance += amount;
    }
}

