using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

public class GameHub : Hub
{
    private static List<User> connectedUserList = new List<User>();
    private static Dictionary<User, User> matchedUser = new Dictionary<User, User>();
    public override async Task OnConnectedAsync()
    {
        connectedUserList.Add(new User { ClientId = Context.ConnectionId });
        await Clients.All.SendAsync("GetAllUser", connectedUserList.Where(x => x.ClientId != Context.ConnectionId && x.Username != null).ToList());
        await Clients.Client(Context.ConnectionId).SendAsync("SetConnectionId", Context.ConnectionId);
    }

    public override async Task OnDisconnectedAsync(System.Exception exception)
    {
        User connectedUser = connectedUserList.Where(x => x.ClientId == Context.ConnectionId).FirstOrDefault();
        if (connectedUser != null)
            connectedUserList.Remove(connectedUser);

        await Clients.All.SendAsync("GetAllUser", connectedUserList.Where(x => x.ClientId != Context.ConnectionId && x.Username != null).ToList());
        await base.OnDisconnectedAsync(exception);
    }

    public async Task AddUserWithName(string userName)
    {
        User connectedUser = connectedUserList.Where(x => x.ClientId == Context.ConnectionId).FirstOrDefault();
        if (connectedUser != null)
        {
            connectedUserList.Remove(connectedUser);
            connectedUser.Username = userName;
            connectedUserList.Add(connectedUser);
        }
        List<User> userListWitoutOwn = connectedUserList.Where(x => x.Username != null).ToList();
        await Clients.AllExcept(Context.ConnectionId).SendAsync("GetAllUser", userListWitoutOwn);
        //await Clients.All.SendAsync("GetAllUser", userListWitoutOwn);
    }

    public async Task SendGameRequest(string receiverClientId)
    {
        await Clients.Client(receiverClientId).SendAsync("GetPlayRequest", connectedUserList.Where(x => x.ClientId == Context.ConnectionId).FirstOrDefault());
    }

    public async Task AcceptGameRequest(string senderClientId)
    {
        User firstUser = connectedUserList.Where(x => x.ClientId == Context.ConnectionId).FirstOrDefault();
        User secondUser = connectedUserList.Where(x => x.ClientId == senderClientId).FirstOrDefault();
        if (firstUser != null && secondUser != null)
        {
            matchedUser.Add(firstUser, secondUser);
            await Clients.Client(firstUser.ClientId).SendAsync("LetsPlay");
            await Clients.Client(secondUser.ClientId).SendAsync("LetsPlay");
        }

        await Task.FromResult(0);
    }

    public async Task SetUserChoice(string userChoice)
    {
        User firstUser;
        User secondUser;

        if (matchedUser.Where(x => x.Key.ClientId == Context.ConnectionId).Any())
            matchedUser.Where(x => x.Key.ClientId == Context.ConnectionId).FirstOrDefault().Key.UserChoice = userChoice;
        else if (matchedUser.Where(x => x.Value.ClientId == Context.ConnectionId).Any())
            matchedUser.Where(x => x.Value.ClientId == Context.ConnectionId).FirstOrDefault().Value.UserChoice = userChoice;

        firstUser = matchedUser.Where(x => x.Key.ClientId == Context.ConnectionId
                                           || x.Value.ClientId == Context.ConnectionId).FirstOrDefault().Key;

        secondUser = matchedUser.Where(x => x.Key.ClientId == Context.ConnectionId
                                           || x.Value.ClientId == Context.ConnectionId).FirstOrDefault().Value;

        //ikiside seçtiyse kazanana karar ver
        if (firstUser.UserChoice != null && secondUser.UserChoice != null)
        {
            switch (firstUser.UserChoice + secondUser.UserChoice)
            {
                case "rs":
                case "pr":
                case "sp":
                    //firt player win
                    await Clients.Client(firstUser.ClientId).SendAsync("Result", "W");
                    await Clients.Client(secondUser.ClientId).SendAsync("Result", "L");
                    break;
                case "rp":
                case "ps":
                case "sr":
                    //second player win
                    await Clients.Client(firstUser.ClientId).SendAsync("Result", "L");
                    await Clients.Client(secondUser.ClientId).SendAsync("Result", "W");
                    break;
                case "rr":
                case "pp":
                case "ss":
                    //draw
                    await Clients.Client(firstUser.ClientId).SendAsync("Result", "D");
                    await Clients.Client(secondUser.ClientId).SendAsync("Result", "D");
                    break;
            }
        }

    }


}