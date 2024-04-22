using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System.Text;
using recognition_api.Services;

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

        //[HttpPost("response")] // default https://localhost:7205/api/response
        //public async Task<IActionResult> postActionResult([FromBody] String name)
        //{
        //    Console.WriteLine("jakies post rekuest");
        //    var name2 = name.Replace("data:image/jpeg;base64,", "");
        //    _myService.SendImageToQueque(name2);

        //    var responseMessage = await _myService.ReceiveMessageAsync();
        //    Console.WriteLine($"responseMessage: {responseMessage}");
        //    return Ok($"response from api {responseMessage}");
        //}

        //[HttpPost("response")] // default https://localhost:7205/api/response
        //public ActionResult postActionResult([FromBody] String name)
        //{
        //    Console.WriteLine("jakies post rekuest");
        //    var name2 = name.Replace("data:image/jpeg;base64,", "");
        //    _myService.SendImageToQueque(name2);

        //    var responseMessage =  _myService.ReceiveMessageAsync();
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

        [HttpPost("response")] // default https://localhost:7205/api/response
        public async Task<ActionResult<string>> postActionResult([FromBody] String name)
        {
            Console.WriteLine("jakies post rekuest");
            var name2 = name.Replace("data:image/jpeg;base64,", "");
            _myService.SendImageToQueque(name2);

            var responseMessage = await _myService.ReceiveMessageAsyncWithoutMemoryLeakage();
            Console.WriteLine($"responseMessage: {responseMessage}");
            var varstring = responseMessage.Split('&');
            var coordinate = varstring[1].Split(',');
            string response =
                $"{{" +
                        $"\"name\":\"{varstring[0]}\"," +
                        $"\"coordinates\":" +
                            $"{{" +
                                $"\"top\":\"{coordinate[0]}\"," +
                                $"\"right\":\"{coordinate[1]}\"," +
                                $"\"bottom\":\"{coordinate[2]}\"," +
                                $"\"left\":\"{coordinate[3]}\"" +
                            $"}}" +
                $"}}";
            Console.WriteLine(response);
            return Ok(response);
        }
    }

   
}