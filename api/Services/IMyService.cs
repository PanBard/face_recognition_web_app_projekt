namespace recognition_api.Services
{
    public interface IMyService
    {
        void ConnectToQueque();
        //Task<string> ReceiveMessageAsync();
        //string ReceiveMessageAsync();
        Task<string> ReceiveMessageAsyncWithoutMemoryLeakage();
        void SendImageToQueque(string image);
    }
}