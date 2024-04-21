namespace recognition_api.Services
{
    public interface IMyService
    {
        void ConnectToQueque();
        //Task<string> ReceiveMessageAsync();
        string ReceiveMessageAsync();
        void SendImageToQueque(string image);
    }
}