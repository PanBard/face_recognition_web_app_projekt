using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System.Text;
using System.Threading.Channels;

namespace recognition_api.Services
{
    public class MyService : IMyService
    {
        private string _responseMessage;
        //private string rabbitURL = "amqp://guest:guest@localhost:5672/";
        private string rabbitURL = "amqp://guest:guest@rabbitmq:5672/";
        public MyService()
        {

        }
        public void ConnectToQueque()
        {
            var factory = new ConnectionFactory()
            {
                Uri = new Uri(rabbitURL)
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "response_from_face_recon",
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                string message = "Hello World!";
                var body = Encoding.UTF8.GetBytes(message);

                channel.BasicPublish(exchange: "",
                                     routingKey: "response_from_face_recon",
                                     basicProperties: null,
                                     body: body);
                Console.WriteLine(" [x] Sent {0}", message);



                channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    Console.WriteLine(" [x] Received {0}", message);

                    channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                };
                channel.BasicConsume(queue: "response_from_face_recon",
                                     autoAck: false,
                                     consumer: consumer);

                Console.WriteLine(" Press [enter] to exit.");
                Console.ReadLine();
            }
        }


        public void SendImageToQueque(String image)
        {
            var factory = new ConnectionFactory()
            {
                Uri = new Uri(rabbitURL)
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "result",
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                var body = Encoding.UTF8.GetBytes(image);

                channel.BasicPublish(exchange: "",
                                     routingKey: "result",
                                     basicProperties: null,
                                     body: body);
                
                Console.WriteLine(" [x] Sent image");

            }
        }





        //public async Task<string> ReceiveMessageAsync()
        //{
        //    var factory = new ConnectionFactory()
        //    {
        //        Uri = new Uri("amqp://guest:guest@localhost:5672/")
        //    };
        //    using (var connection = factory.CreateConnection())
        //    using (var channel = connection.CreateModel())
        //    {
        //        channel.QueueDeclare(queue: "response_from_face_recon",
        //                             durable: false,
        //                             exclusive: false,
        //                             autoDelete: false,
        //                             arguments: null);

        //        var consumer = new EventingBasicConsumer(channel);
        //        consumer.Received += (model, ea) =>
        //        {
        //            var body = ea.Body.ToArray();
        //            _responseMessage = Encoding.UTF8.GetString(body);
        //        };
        //        channel.BasicConsume(queue: "response_from_face_recon",
        //                             autoAck: true,
        //                             consumer: consumer);

        //        while (_responseMessage == null)
        //        {
        //            await Task.Delay(100); // Oczekiwanie na odpowiedź z kolejki
        //        }

        //        return _responseMessage;
        //    }
        //}

        public  string ReceiveMessageAsync()
        {
            var factory = new ConnectionFactory()
            {
                Uri = new Uri(rabbitURL)
            };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "response_from_face_recon",
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    _responseMessage = Encoding.UTF8.GetString(body);
                };
                channel.BasicConsume(queue: "response_from_face_recon",
                                     autoAck: true,
                                     consumer: consumer);

                while (_responseMessage == null)
                {
                     Task.Delay(100); // Oczekiwanie na odpowiedź z kolejki
                }

                return _responseMessage;
            }
        }









    }
}
