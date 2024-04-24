using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System.Text;
using System.Threading.Channels;
using Npgsql;
using System.Xml;
using Newtonsoft.Json;
using Formatting = Newtonsoft.Json.Formatting;
using System.Xml.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System;
using System.Collections.Generic;
using static System.Net.Mime.MediaTypeNames;
using System.Buffers.Text;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Numerics;
using MathNet.Numerics.LinearAlgebra;

namespace recognition_api.Services
{
    public class MyService : IMyService 
    {
        private string _responseMessage;

        //private string rabbitURL = "amqp://guest:guest@localhost:5672/";
        private string rabbitURL = "amqp://guest:guest@rabbitmq:5672/";

        //private string connectionString = "Host=localhost;Port=5432;Username=admin;Password=password;Database=postgres;";
        private string connectionString = "Host=postgre_db;Port=5432;Username=admin;Password=password;Database=postgres;";


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
                    ogarnianieDanychZModelu(message);

                    channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                };
                channel.BasicConsume(queue: "response_from_face_recon",
                                     autoAck: false,
                                     consumer: consumer);

                Console.WriteLine(" Press [enter] to exit.");
                Console.ReadLine();
            }
        }

        public dynamic ogarnianieDanychZModelu(string data)
        {
            dynamic d = JObject.Parse(data);

            return d;
        }


        public void SendImageToQueque(string image)
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

        public async Task<dynamic> ReceiveMessageAsyncWithoutMemoryLeakage()
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
                var tcs = new TaskCompletionSource<string>();

                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var responseMessage = Encoding.UTF8.GetString(body);
                    tcs.SetResult(responseMessage);
                };

                channel.BasicConsume(queue: "response_from_face_recon",
                                     autoAck: true,
                                     consumer: consumer);

                var responseMessage = await tcs.Task; // Oczekiwanie na odpowiedź z kolejki

                var data = ogarnianieDanychZModelu(responseMessage);
                return data;
            }
        }


        public string GetDataFromPostgreSQL()
        {
            
            string query = "SELECT * FROM eloszki;";
            List<Dictionary<string, object>> data = new List<Dictionary<string, object>>();

            using (NpgsqlConnection connection = new NpgsqlConnection(this.connectionString))
            {
                using (NpgsqlCommand command = new NpgsqlCommand(query, connection))
                {
                    try
                    {
                        connection.Open();
                        Console.WriteLine("Connection to PostgreSQL database opened successfully!");
                        using (NpgsqlDataReader reader = command.ExecuteReader())
                        {
                             
                            while (reader.Read())//iteration on data from db
                            {                                
                                Dictionary<string, object> row = new Dictionary<string, object>();
                               
                                for (int i = 0; i < reader.FieldCount; i++)  // take data from each column and make dict
                                {
                                    if( reader.GetName(i) == "image" && !reader.IsDBNull(i) )
                                    {
                                        byte[] bytes = (byte[])reader.GetValue(i);
                                        string base64String = Convert.ToBase64String(bytes);
                                        row[reader.GetName(i)] = "data:image / jpeg; base64,"+ base64String;
                                    }
                                    else
                                    {
                                        row[reader.GetName(i)] = reader.GetValue(i);
                                    }
                                    
                                    Console.WriteLine($" {reader.GetName(i)} : {reader.GetValue(i)}");
                                }                                
                                data.Add(row);                                
                            }
                        }
                    }
                    catch (Exception ex)
                    {                       
                        Console.WriteLine("Error fetching data from PostgreSQL database: " + ex.Message);
                    }
                }
            }

            // Konwertowanie listy danych na JSON za pomocą biblioteki Newtonsoft.Json
            string jsonData = JsonConvert.SerializeObject(data, Formatting.Indented);

            // Zwracanie danych w formacie JSON
            return jsonData;
        }



        public string SendDataToDatabase(string name, string password, string imageBase64, dynamic encoding)
        {
            byte[] image_bytes = ConvertBase64StringToBytes(imageBase64);
            double[] doubleArray = encoding.ToObject<double[]>();
            string query = "INSERT INTO eloszki (name, password, image,encoding) VALUES (@Name, @Password, @Image, @Encoding);";

            // Tworzenie obiektu połączenia do PostgreSQL
            using (NpgsqlConnection connection = new NpgsqlConnection(connectionString))
            {
                // Tworzenie obiektu komendy do wykonania zapytania SQL
                using (NpgsqlCommand command = new NpgsqlCommand(query, connection))
                {
                    // Dodawanie parametrów do zapytania SQL
                    command.Parameters.AddWithValue("@Name", name);
                    command.Parameters.AddWithValue("@Password", password);
                    command.Parameters.AddWithValue("@Image", NpgsqlTypes.NpgsqlDbType.Bytea, image_bytes);
                    command.Parameters.AddWithValue("@Encoding", doubleArray);

                    try
                    {
                        // Otwarcie połączenia
                        connection.Open();
                        Console.WriteLine("Connection to PostgreSQL database opened successfully!");

                        // Wykonanie zapytania
                        int rowsAffected = command.ExecuteNonQuery();
                        string response = $"{rowsAffected} row(s) inserted successfully.";
                        Console.WriteLine(response);
                        return response;
                    }
                    catch (Exception ex)
                    {
                        // Obsługa błędów podczas wysyłania danych
                        Console.WriteLine("Error sending data to PostgreSQL database: " + ex.Message);
                        return "Error sending data to PostgreSQL database";
                    }
                }
            }
        }

        public string DeleteDataFromDatabase(int id)
        {
            // Tworzenie zapytania SQL z parametrami
            string query = $"DELETE FROM eloszki WHERE id = {id};";

            // Tworzenie obiektu połączenia do PostgreSQL
            using (NpgsqlConnection connection = new NpgsqlConnection(connectionString))
            {
                // Tworzenie obiektu komendy do wykonania zapytania SQL
                using (NpgsqlCommand command = new NpgsqlCommand(query, connection))
                {                                       
                    try
                    {
                        // Otwarcie połączenia
                        connection.Open();
                        Console.WriteLine("Connection to PostgreSQL database opened successfully!");

                        // Wykonanie zapytania
                        int rowsAffected = command.ExecuteNonQuery();
                        string response = $"{rowsAffected} row(s) deleted successfully.";
                        Console.WriteLine(response);
                        return response;
                    }
                    catch (Exception ex)
                    {
                        // Obsługa błędów podczas wysyłania danych
                        Console.WriteLine("Error deleting data from PostgreSQL database: " + ex.Message);
                        return "Error deleting data from PostgreSQL database";
                    }
                }
            }
        }


        public string SendImageToDB(string image)
        {
            byte[] image_bytes = ConvertBase64StringToBytes(image);
            string query = "INSERT INTO eloszki (name, password,image) VALUES (@Name, @Password,@ImageData);";
            

            // Tworzenie obiektu połączenia do PostgreSQL
            using (NpgsqlConnection connection = new NpgsqlConnection(connectionString))
            {
                // Tworzenie obiektu komendy do wykonania zapytania SQL
                using (NpgsqlCommand command = new NpgsqlCommand(query, connection))
                {
                    // Dodawanie parametrów do zapytania SQL
                    command.Parameters.AddWithValue("@ImageData", NpgsqlTypes.NpgsqlDbType.Bytea, image_bytes);
                    command.Parameters.AddWithValue("@Name", "img");
                    command.Parameters.AddWithValue("@Password", "img");

                    try
                    {
                        // Otwarcie połączenia
                        connection.Open();
                        Console.WriteLine("Connection to PostgreSQL database opened successfully!");

                        // Wykonanie zapytania INSERT
                        int rowsAffected = command.ExecuteNonQuery();
                        Console.WriteLine($"{rowsAffected} row(s) inserted successfully.");
                    }
                    catch (Exception ex)
                    {
                        // Obsługa błędów podczas zapisywania danych
                        Console.WriteLine("Error saving image to PostgreSQL database: " + ex.Message);
                    }
                }
            }
            return "";
        }

        public byte[] ConvertBase64StringToBytes(string base64String)
        {
            try
            {
                // Konwersja stringa Base64 na tablicę bajtów
                byte[] bytes = Convert.FromBase64String(base64String);
                return bytes;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error converting Base64 string to image_bytes: " + ex.Message);
                return null;
            }
        }



        



        public (List<string>, List<double[]>) GetSpecificFromPostgreSQL()
        {

            string query = "SELECT name, encoding FROM eloszki;";
            List<Dictionary<string, object>> data = new List<Dictionary<string, object>>();
            List<string> names = new List<string>();
            List<double[]> enco = new List<double[]>();

            using (NpgsqlConnection connection = new NpgsqlConnection(this.connectionString))
            {
                using (NpgsqlCommand command = new NpgsqlCommand(query, connection))
                {
                    try
                    {
                        connection.Open();
                        Console.WriteLine("Connection to PostgreSQL database opened successfully!");
                        using (NpgsqlDataReader reader = command.ExecuteReader())
                        {
                           

                            while (reader.Read())//iteration on data from db
                            {
                                string id = reader.GetString(reader.GetOrdinal("name"));
                                names.Add(id);
                                double[] values = (double[])reader["encoding"];
                                //double d = reader.GetDouble(reader.GetOrdinal("encoding"));
                                enco.Add(values);
                            }

                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Error fetching data from PostgreSQL database: " + ex.Message);
                    }
                }
            }
           
            return (names, enco);
        }





        public string CompareFaces(double[] embargo)
        {
            var result = GetSpecificFromPostgreSQL();

            List<string> names = result.Item1;
            List<double[]> enco = result.Item2;
            List<double> all = new List<double>();

            double[] faceEncodingsDecimals = embargo;
            foreach (double[] values in enco)
            {
                
                double[] faceToCompareDecimals = values;

                double[] faceEncodingsDoubles = faceEncodingsDecimals.Select(Convert.ToDouble).ToArray();
                double[] faceToCompareDoubles = faceToCompareDecimals.Select(Convert.ToDouble).ToArray();

                MathNet.Numerics.LinearAlgebra.Vector<double> faceEncodings = MathNet.Numerics.LinearAlgebra.Vector<double>.Build.DenseOfArray(faceEncodingsDoubles);
                MathNet.Numerics.LinearAlgebra.Vector<double> faceToCompare = MathNet.Numerics.LinearAlgebra.Vector<double>.Build.DenseOfArray(faceToCompareDoubles);

                double normResult = (faceEncodings - faceToCompare).L2Norm();

                //MathNet.Numerics.LinearAlgebra.Vector<double> faceEncodings = MathNet.Numerics.LinearAlgebra.Vector<double>.Build.DenseOfArray(new double[] { 1.0, 2.0, 3.0 });
                //MathNet.Numerics.LinearAlgebra.Vector<double> faceToCompare = MathNet.Numerics.LinearAlgebra.Vector<double>.Build.DenseOfArray(new double[] { 4.0, 5.0, 6.0 });

                //    double normResult = (faceEncodings - faceToCompare).L2Norm();

                Console.WriteLine(normResult);
                all.Add(normResult);
            }

            int minIndex = all.IndexOf(all.Min());

            if (all[minIndex] > 0.50)
            {
                return "Unrecognized";
            }
            else return names[minIndex];                     
        }



    }





    }

    //public class DataForomModel
    //{
    //    public int top { get; set; }
    //    public int right { get; set; }
    //    public int bottom { get; set; }
    //    public int left { get; set; }

    //    public Array<float> encoding { get; set; }
    //    public string ImageString { get; set; }

    //}

