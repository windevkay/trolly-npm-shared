import { Message, Stan } from "node-nats-streaming";

import { Subjects } from "./subjects";

interface ListenerEvent {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends ListenerEvent> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected ackWait = 5000; //5 seconds
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions = () => {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  };

  /**
   * method that handles subscribing to a channel
   */
  listen = () => {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  };

  parseMessage = (msg: Message) => {
    const data = msg.getData();
    // data could be a string or a buffer, handle cases for both
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  };
}
