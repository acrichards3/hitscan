import geckos from "@geckos.io/server";
import { GameState, PlayerState } from "@fps/lib";

const io = geckos();

const state: GameState = {
    players: {},
};

io.listen(3000); // default port is 9208

io.onConnection((channel) => {
    const id = channel.id;
    if (id == null) {
        return;
    }
    console.log("connect", channel);
    channel.onDisconnect(() => {
        delete state.players[id];
        console.log(`${channel.id} got disconnected`);
    });
    channel.on("client-tick", (data) => {
        state.players[id] = data as PlayerState;
    });
});

setInterval(() => {
    io.emit("server-tick", state);
}, 1000 / 60);
