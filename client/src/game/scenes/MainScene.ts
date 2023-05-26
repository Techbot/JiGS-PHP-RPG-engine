/**
 * ---------------------------
 * Phaser + Colyseus - Part 4.
 * ---------------------------
 * - Connecting with the room
 * - Sending inputs at the user's framerate
 * - Update other player's positions WITH interpolation (for other players)
 * - Client-predicted input for local (current) player
 * - Fixed tickrate on both client and server
 */

import Phaser from "phaser";
import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../backend";
import { useCounterStore } from '../../stores/counter';
import Player from "../entities/player";
import NPC from "../entities/npc";
import Mob from "../entities/mob";
import Reward from "../entities/reward";
import Load from "../entities/loader";
import Portals from "../entities/portals";
import { createCharacterAnims } from "../entities/anim";
import axios from "axios";

export class MainScene extends Phaser.Scene {
    room: Room;
    currentPlayer: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    playerEntities: { [sessionId: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody } = {};
    debugFPS: Phaser.GameObjects.Text;
    localRef: Phaser.GameObjects.Rectangle;
    remoteRef: Phaser.GameObjects.Rectangle;
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    inputPayload = {
        left: false,
        right: false,
        up: false,
        down: false,
        tick: undefined,
    };

    elapsedTime = 0;
    fixedTimeStep = 1000 / 60;
    portal = [];
    currentTick: number = 0;
    counter: any;
    load: any;
    input: any;
    add: any;
    anims: any;
    make: any;
    physics: any;
    key_left: any;
    key_up: any;
    key_right: any;
    key_down: any;
    bullets: any;
    cameras: any;
    client: Client;
    localPlayer: Player;
    Loader: Load;
    scene: any;
    game: any;
    colliderMap: any;
    npcArray: any;
    rewards: any;
    rewardsArray: any;
    rewardsGroup: any;
    NPCcontainer: any;
    SceneNpcArray: any;
    SceneNpcNameArray: any;
    NpcContainerArray: any;
    MobContainerArray: any;
    SceneMobArray: any;
    mobArray: any;
    SceneMobHealthBarArray: any;
    SceneMobNameArray: any[];

    constructor() {
        super({ key: "main" });
        this.counter = useCounterStore();
        this.client = new Client(BACKEND_URL);
        this.localPlayer = new Player;
        this.rewardsArray= new Array;
        this.rewardsArray = new Array;
        this.NpcContainerArray = new Array;
        this.MobContainerArray = new Array;
        this.SceneNpcArray = new Array;
        this.SceneMobArray = new Array;
        this.SceneNpcNameArray = new Array;
        this.SceneMobHealthBarArray = new Array;
        this.SceneMobNameArray = new Array;
    }
    preload() {
         this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    }
    async create() {
        var self = this;
        this.Loader = new Load;
        this.Loader.load(self);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000", });
        // connect with the room
        await this.connect(this.counter.city + "-" + padding(this.counter.tiled, 3, 0));
        this.room.onMessage("portal", (message) => {
            console.log("portal message received from server");
            console.log(message);
            const promise1 = Promise.resolve(this.jump());
            self.counter.tiled = message;
            //  hide(this.localPlayer);
        });
        this.room.onMessage("collide", (message) => {
            console.log("collide message received from server");
            self.currentPlayer.y = self.remoteRef.y;
            self.currentPlayer.x = self.remoteRef.x;
        });
        this.room.onMessage("reward", (message) => {
            self.currentPlayer.y = self.remoteRef.y;
            self.currentPlayer.x = self.remoteRef.x;
            console.log("reward message received from server");
            console.log(message);
            this.counter.playerStats.credits++;
            //   this.incrementReward();
        });
        this.room.onMessage("remove-reward", (message) => {
            self.currentPlayer.y = self.remoteRef.y;
            self.currentPlayer.x = self.remoteRef.x;
            console.log("remove-reward message received from server");
            console.log(message);
            console.log(self.rewards);

            //    this.incrementReward();
             let i = 0;
            while (i < self.rewardsArray.length) {
                console.log('able baby');
                if (self.rewardsArray[i].ref == message){
                    console.log('disable baby');
                    self.rewardsArray[i].disableBody(true, true);
                }
                i++;
            }
        });
        this.room.state.players.onAdd((player, sessionId) => {
            var entity: any;
            // is current player
            if (sessionId === this.room.sessionId) {
                this.localPlayer.addLocalPLayer(this, player, entity, this.colliderMap);

                /*-------------------- Rewards ----------------------*/
                this.rewardsGroup = self.physics.add.group({ allowGravity: false });
                let a = 0;
                if (typeof this.counter.rewardsArray !== 'undefined') {
                    while (a < this.counter.rewardsArray.length) {
                        console.log('Rewards :' + this.counter.rewardsArray[a]);
                        this.rewardsArray[a] = new Reward(self, this.counter.rewardsArray[a]);
                        this.rewardsGroup.add(this.rewardsArray[a], true);
                        a++;
                    }
                }
                /*-------------------- Npcs ----------------------*/
                this.npcArray = self.physics.add.group({ allowGravity: false });
                if (typeof this.counter.npcArray !== 'undefined') {
                    let i = 0;
                    while (i < this.counter.npcArray.length) {
                        console.log('Npc :' + this.counter.npcArray[i][3]);
                        this.NpcContainerArray[i] = this.add.container(parseInt(this.counter.npcArray[i][1]), parseInt(this.counter.npcArray[i][2]));
                        this.SceneNpcArray[i] = this.add.sprite(0, 0, 'npc' + this.counter.npcArray[i][3]).setScale(.75);
                        this.SceneNpcNameArray[i] = this.add.text(10,-10,this.counter.npcArray[i][0]);
                        this.NpcContainerArray[i].add(this.SceneNpcArray[i]);
                        this.NpcContainerArray[i].add(this.SceneNpcNameArray[i]);
                        this.NpcContainerArray[i].setDepth(5);
                        this.npcArray.add(this.NpcContainerArray[i], true);
                        i++;
                    }
                }
                /*-------------------- Mobs ----------------------*/
                this.mobArray = self.physics.add.group({ allowGravity: false });
                if (typeof this.counter.mobArray !== 'undefined') {
                    let i = 0;
                    while (i < this.counter.mobArray.length) {
                        console.log('Mob :' + this.counter.mobArray[i][3]);
                        this.MobContainerArray[i] = this.add.container(parseInt(this.counter.mobArray[i][1]), parseInt(this.counter.mobArray[i][2]));
                        this.SceneMobArray[i] = this.add.sprite(0, 0, 'mob' + this.counter.mobArray[i][3]).setScale(.75);
                        this.SceneMobHealthBarArray[i] = this.add.image(0, -30, 'healthBar');
                        this.SceneMobHealthBarArray[i].displayWidth=10;
                        this.MobContainerArray[i].add(this.SceneMobArray[i]);
                        this.MobContainerArray[i].add(this.SceneMobHealthBarArray[i]);
                        this.MobContainerArray[i].setDepth(5);
                        this.mobArray.add(this.MobContainerArray[i], true);
                        i++;
                   }
                }

            } else {
                entity = this.physics.add.sprite(player.x, player.y, 'otherPlayer').setDepth(3).setScale(.75);
                // listening for server updates
                player.onChange(() => {
                    //
                    // we're going to LERP the positions during the render loop.
                    //
                    entity.setData('serverX', player.x);
                    entity.setData('serverY', player.y);
                });
            }
            this.playerEntities[sessionId] = entity;
        });
        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((player, sessionId) => {
            const entity = this.playerEntities[sessionId];
            if (entity) {
                entity.destroy();
                delete this.playerEntities[sessionId]
            }
        });
        this.cameras.main.setZoom(1.5);
        //this.cameras.main.setBounds(0, 0, 4096, 4096);
    }
    incrementReward() {
        return;
    }

    jump() {
        console.log("jump");
        axios
            .get("https://www.eclecticmeme.com/mystate?_wrapper_format=drupal_ajax")
            .then((response) => {
                this.counter.gameState      = response.data[0].value["userGamesState"];
                this.counter.playerStats    = response.data[0].value["playerStats"];
                this.counter.userMapGrid    = parseInt(response.data[0].value["userMapGrid"]);
                this.counter.tiled          = parseInt(response.data[0].value["Tiled"]);
                this.counter.portalsArray   = response.data[0].value["portalsArray"];
                this.counter.npcArray       = response.data[0].value["NpcArray"];
                this.counter.mobArray       = response.data[0].value["MobArray"];
                this.counter.rewardsArray   = response.data[0].value["rewardsArray"];
                this.counter.nodeTitle      = response.data[0].value["Name"];
                this.counter.city           = response.data[0].value["City"];
                this.counter.tilesetArray_1 = response.data[0].value["tilesetArray_1"];
                this.counter.tilesetArray_2 = response.data[0].value["tilesetArray_2"];
                this.counter.tilesetArray_3 = response.data[0].value["tilesetArray_3"];
                this.counter.tilesetArray_4 = response.data[0].value["tilesetArray_4"];
                // this.counter.tilesetArray_5 = response.data[0].value["tilesetArray_5"];
                var Loader = new Load;
                Loader.load(this);
                //portalJump(this);
                this.room.leave(); // Backend
                this.scene.start('main'); //Frontend
            });

        return true;
    }

    async connect(room) {
        // add connection status text
        const connectionStatusText = this.add
            .text(0, 0, "Trying to connect with the server...")
            .setStyle({ color: "#ff0000" })
            .setPadding(4)
        try {
            this.room = await this.client.joinOrCreate(room,
                {
                    playerId: this.counter.playerId
                });
            // connection successful!
            connectionStatusText.destroy();
        } catch (e) {
            // couldn't connect
            connectionStatusText.text = "Could not connect with the server.";
        }
    }

    update(time: number, delta: number): void {
        // skip loop if not connected yet.
        if (!this.currentPlayer || !this.playerEntities) { return; }
        this.elapsedTime += delta;
        while (this.elapsedTime >= this.fixedTimeStep) {
            this.elapsedTime -= this.fixedTimeStep;
            this.fixedTick(time, this.fixedTimeStep);
        }
        this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;
    }

    fixedTick(time, delta) {
        this.currentTick++;
        if (this.localPlayer !== undefined) {
            this.localPlayer.updatePlayer(this);
            // const currentPlayerRemote = this.room.state.players.get(this.room.sessionId);
            // const ticksBehind = this.currentTick - currentPlayerRemote.tick;
            // console.log({ ticksBehind });
            for (let sessionId in this.playerEntities) {
                // interpolate all player entities
                // (except the current player)
                if (sessionId === this.room.sessionId) {
                    continue;
                }
                if (this.playerEntities[sessionId] !== undefined) {
                    const entity = this.playerEntities[sessionId];
                    if (entity.data) {
                        const { serverX, serverY } = entity.data.values;
                        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
                        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
                    }
                }
            }
        }
    }
}

function padding(n, p, c) {
    var pad_char = typeof c !== 'undefined' ? c : '0';
    var pad = new Array(1 + p).join(pad_char);
    return (pad + n).slice(-pad.length);
}

async function portalJump(self) {
    await self.room.leave(); // Backend
    await self.scene.start('main'); //Frontend

}

async function hide(entity) {
    entity.disableBody(true, true);
}
