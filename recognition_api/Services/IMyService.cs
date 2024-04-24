using System.Runtime.InteropServices.JavaScript;

namespace recognition_api.Services
{
    public interface IMyService
    {
        string CompareFaces(double[] embargo);
        void ConnectToQueque();
        string DeleteDataFromDatabase(int id);
        string GetDataFromPostgreSQL();
        (List<string>, List<double[]>) GetSpecificFromPostgreSQL();

        //Task<string> ReceiveMessageAsync();
        //string ReceiveMessageAsync();
        Task<dynamic> ReceiveMessageAsyncWithoutMemoryLeakage();
        string SendDataToDatabase(string name, string password, string imageBase64, dynamic encoding);
        string SendImageToDB(string image);
        void SendImageToQueque(string image);
    }
}