// @flow
import amqp from 'amqplib/callback_api';

const connection = 'amqp://localhost';


export const crawl = (url: string) : string {
    // Doing HTTP Request
}

export const dispatch = (job: any) : void {
    amqp.connect(connection, (error, connection) => {
        con.createChannel((error, channel) => {
            const queue = 'crawler';

            const message = 'Job was dispatched';

            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, Buffer.from(message));
            console.log(`[x] Sent ${message}`);
        });

        setTimeout(() => {
            connection.close();
        }, 500);
    });
}
