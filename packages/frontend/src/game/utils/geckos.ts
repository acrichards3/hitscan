import { geckos } from "@geckos.io/client";

export const channel = geckos({
    port: 3000,
    url: "http://localhost",
});

channel
    .onConnect((error) => {
        if (error) {
            console.error("Status: ", error.status);
            console.error("StatusText: ", error.statusText);
        }
        console.log("GECKOS", channel.userData); // { username: 'Yannick', level: 13, points: 8987 }
    })
    .then(console.log)
    .catch(console.error);
