using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System.Text;
using recognition_api.Services;
using System.Xml.Linq;
using System.Text.Json.Nodes;

namespace recognition_api.Controllers
{
    [ApiController]
    [Route("api")]
    public class Controller : ControllerBase
    {
        private readonly IMyService _myService;
        private readonly ILogger<Controller> _logger;


        public Controller(ILogger<Controller> logger, IMyService myService)
        {
            _myService = myService;
            _logger = logger;
        }

        [HttpGet("get")]
        public String Get()
        {
            _myService.ConnectToQueque();
            return "allright";
        }

        [HttpGet("trigger")]
        public String Trigger()
        {
            //_myService.CompareFaces();
            //_myService.CompareFaces();
            return "allright";
        }

        [HttpGet("api_test")]
        public String ApiTest()
        {
            return "{\"data\":\" API is working properly\"}";
        }

        [HttpGet("database_test")]
        public String DatabaseTest()
        {
           string response = _myService.GetDataFromPostgreSQL();
            return response;
        }

        //[HttpPost("database/addUser")] 
        //public String AddToDatabase([FromQuery] string name, string password)
        //{
        //    string response = _myService.SendDataToDatabase(name, password);
        //    return response;
        //}



        //[HttpPost("response")] // default https://localhost:7205/api/response
        //public async Task<ActionResult<string>> postActionResult([FromBody] String name)
        //{
        //    Console.WriteLine("jakies post rekuest");
        //    var name2 = name.Replace("data:image/jpeg;base64,", "");
        //    _myService.SendImageToQueque(name2);

        //    var responseMessage = await _myService.ReceiveMessageAsyncWithoutMemoryLeakage();
        //    Console.WriteLine($"responseMessage: {responseMessage}");
        //    var varstring = responseMessage.Split('&');
        //    var coordinate = varstring[1].Split(',');
        //    string response =
        //        $"{{" +
        //                $"\"name\":\"{varstring[0]}\"," +
        //                $"\"coordinates\":" +
        //                    $"{{" +
        //                        $"\"top\":\"{coordinate[0]}\"," +
        //                        $"\"right\":\"{coordinate[1]}\"," +
        //                        $"\"bottom\":\"{coordinate[2]}\"," +
        //                        $"\"left\":\"{coordinate[3]}\"" +
        //                    $"}}" +
        //        $"}}";
        //    Console.WriteLine(response);
        //    return Ok(response);
        //}

        [HttpPost("database/addNewProfile")] // default https://localhost:7205/database/addNewProfile
        public async Task<IActionResult> GetDataFromFrontendAsync([FromBody] DataModelFromFrontend data)
        {
            if (data != null)
            {
                var image_url = data.ImageString;
                var image_base64 = image_url.Replace("data:image/jpeg;base64,", "");
                var response = $"Received data: Key = {data.Name}, Value = {data.Password}, Image = ";
                Console.WriteLine(response);
                _myService.SendImageToQueque(image_base64);
                var responseMessage = await _myService.ReceiveMessageAsyncWithoutMemoryLeakage();
                Console.WriteLine($"responseMessage: {responseMessage}");
                Console.WriteLine($"responseMessage: {responseMessage.encoding.GetType()}");
                _myService.SendDataToDatabase(data.Name, data.Password, image_base64, responseMessage.encoding);
                return Ok($"{{" +
                        $"\"name\":\"najs\"," +
                        $"\"coordinates\":" +
                            $"{{" +
                                $"\"top\":\"{responseMessage.top}\"," +
                                $"\"right\":\"{responseMessage.right}\"," +
                                $"\"bottom\":\"{responseMessage.bottom}\"," +
                                $"\"left\":\"{responseMessage.left}\"" +
                            $"}}" +
                $"}}");
            }
            else
            {
                return BadRequest("Invalid data received.");
            }
        }


        [HttpPost("database/checkFace")] // default https://localhost:7205/database/addNewProfile
        public async Task<IActionResult> CheckFace([FromBody] string only_image_url)
        {
            if (only_image_url != null)
            {
                
                var image_base64 = only_image_url.Replace("data:image/jpeg;base64,", "");
                _myService.SendImageToQueque(image_base64);
                var responseMessage = await _myService.ReceiveMessageAsyncWithoutMemoryLeakage();
                
                Console.WriteLine($"responseMessage: {responseMessage.encoding.GetType()}");
                if(responseMessage.encoding[0] != 1)
                {
                    double[] doubleArray = responseMessage.encoding.ToObject<double[]>();
                    string name = _myService.CompareFaces(doubleArray);
                    return Ok($"{{" +
                        $"\"name\":\"{name}\"," +
                        $"\"coordinates\":" +
                            $"{{" +
                                $"\"top\":\"{responseMessage.top}\"," +
                                $"\"right\":\"{responseMessage.right}\"," +
                                $"\"bottom\":\"{responseMessage.bottom}\"," +
                                $"\"left\":\"{responseMessage.left}\"" +
                            $"}}" +
                        $"}}");
                }
                else
                {
                    return Ok($"{{" +
                        $"\"name\":\"FACE NOT DETECTED\"," +
                        $"\"coordinates\":" +
                            $"{{" +
                                $"\"top\":\"{responseMessage.top}\"," +
                                $"\"right\":\"{responseMessage.right}\"," +
                                $"\"bottom\":\"{responseMessage.bottom}\"," +
                                $"\"left\":\"{responseMessage.left}\"" +
                            $"}}" +
                        $"}}");
                }
              
                
            }
            else
            {
                return BadRequest("Invalid data received.");
            }
        }


        //[HttpPost("database/add")] // default https://localhost:7205/api/response
        //public  IActionResult AddUser([FromBody] MyDataModel data)
        //{
        //    if (data != null)
        //    {
        //        var response = $"Received data: Key = {data.Name}, Value = {data.Password}";
        //        Console.WriteLine(response);
        //        _myService.SendDataToDatabase(data.Name, data.Password);
        //        return Ok($"{{ \"data\" : \"{response}\"}}");
        //    }
        //    else
        //    {
        //        return BadRequest("Invalid data received.");
        //    }
        //}

        [HttpDelete("database/delete/{id}")] //np. https://localhost:7268/demoApi/fromroute/12
        public String DeleteRecorFromDB([FromRoute] int id)
        {
            
            var response = $"delete item of id = {id}";
            _myService.DeleteDataFromDatabase(id);
            Console.WriteLine(response);
            return $"{{ \"data\" : \"{response}\"}}";
        }
     

        //[HttpPost("response")] // default https://localhost:7205/api/response
        //public async Task<ActionResult<string>> postActionResult([FromBody] String name)
        //{
        //    Console.WriteLine("jakies post rekuest");
        //    var name2 = name.Replace("data:image/jpeg;base64,", "");
        //    _myService.SendImageToDB(name2);
        //    string response =
        //        "{" + "\"name\":\"elo\"" + "}";
        //    Console.WriteLine(response);
        //    return Ok(response);
        //}

        



    }




    public class MyDataModel
    {
        public string Name { get; set; }
        public string Password { get; set; }
    }

    public class DataModelFromFrontend
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string ImageString {  get; set; }

    }

    public class ResponseDataForFrontend
    {
        public string Name { get; set; }
        public string Password { get; set; }
        public string ImageString { get; set; }

    }



}