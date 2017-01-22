/*
 Copyright (C) 2013-2015 by Justin DuJardin and Contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {GameWorld} from './gameWorld';
import {GameTileMap} from '../../game/gameTileMap';
import {HeroModel, HeroTypes} from '../../game/rpg/models/heroModel';
import {ItemModel} from '../../game/rpg/models/itemModel';
import {GameEntityObject} from '../../game/rpg/objects/gameEntityObject';
import {GameStateMachine} from '../../game/rpg/states/gameStateMachine';
import {ResourceLoader} from '../../game/pow-core/resourceLoader';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {GameStateLoadAction} from '../models/game-state/game-state.actions';
import {AppState} from '../app.model';
import {Point} from '../../game/pow-core';
import {GameState} from "../models/game-state/game-state.model";
import * as _ from 'underscore';
import {PartyMember} from "../models/party/party.model";

@Injectable()
export class RPGGame {
  styleBackground: string = 'rgba(0,0,0,1)';
  private _renderCanvas: HTMLCanvasElement;
  private _canvasAcquired: boolean = false;
  private _stateKey: string = "_angular2PowRPGState";

  constructor(public loader: ResourceLoader,
              public world: GameWorld,
              private store: Store<AppState>) {
    this._renderCanvas = <HTMLCanvasElement>document.createElement('canvas');
    this._renderCanvas.width = this._renderCanvas.height = 64;
    this._renderCanvas.style.position = 'absolute';
    this._renderCanvas.style.left = this._renderCanvas.style.top = '-9000px';
    this.world.time.start();
    this.store.subscribe()
  }

  getSaveData(): any {
    return localStorage.getItem(this._stateKey);
  }

  resetGame() {
    localStorage.removeItem(this._stateKey);
  }

  saveGame() {
    throw new Error('to reimplement with redux store');
    // const party = <PlayerComponent>this.world.scene.componentByType(PlayerComponent);
    // if (party) {
    //   this.world.model.setKeyData('playerPosition', party.host.point);
    // }
    // this.world.model.setKeyData('playerMap', this.partyMapName);
    // const data = JSON.stringify(this.world.model.toJSON());
    // localStorage.setItem(this._stateKey, data);
  }


  /** Create a detached player entity that can be added to an arbitrary scene. */
  createPlayer(from: PartyMember, tileMap: GameTileMap, at?: Point): Promise<GameEntityObject> {
    if (!from) {
      return Promise.reject("Cannot create player without valid model");
    }
    const heroModel = new HeroModel(from);
    if (!this.world.entities.data) {
      return Promise.reject("Cannot create player before entities container is loaded");
    }
    return this.world.entities
      .createObject('GameMapPlayer', {
        model: heroModel,
        map: tileMap
      })
      .then((sprite: GameEntityObject): GameEntityObject|Promise<GameEntityObject> => {
        if (!sprite) {
          return Promise.reject("Failed to create map player");
        }
        sprite.name = from.name;
        sprite.icon = from.icon;
        return sprite;
      });
  }

  /**
   * Initialize the game and resolve a promise that indicates whether the game
   * is new or was loaded from save data.  Resolves with true if the game is new.
   */
  initGame(data: any = this.getSaveData()): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (data) {
        const json = JSON.parse(data);
        // Set the root game state
        this.store.dispatch(new GameStateLoadAction(json));
        const at = json.position;
        resolve(false);
      }
      else {
        this.world.model.addHero(HeroModel.create(HeroTypes.Warrior, "Warrior"));
        this.world.model.addHero(HeroModel.create(HeroTypes.Ranger, "Ranger"));
        this.world.model.addHero(HeroModel.create(HeroTypes.LifeMage, "Mage"));
        const gameData = _.pick(this.world.model.toJSON(), ['party', 'gold']);
        const initialState: GameState = _.extend({}, {
          party: [],
          keyData: {},
          gold: 0,
          combatZone: '',
          map: 'town',
          position: {x: 12, y: 5}
        }, gameData);
        this.store.dispatch(new GameStateLoadAction(initialState));

        resolve(true);
      }
    });
  }

  party: HeroModel[] = [];
  inventory: ItemModel[] = [];
  player: HeroModel = null;


  /**
   * Returns a canvas rendering context that may be drawn to.  A corresponding
   * call to releaseRenderContext will return the drawn content of the context.
   */
  getRenderContext(width: number, height: number): CanvasRenderingContext2D {
    if (this._canvasAcquired) {
      throw new Error("Only one rendering canvas is available at a time.  Check for calls to this function without corresponding releaseCanvas() calls.");
    }
    this._canvasAcquired = true;
    this._renderCanvas.width = width;
    this._renderCanvas.height = height;
    var context: any = this._renderCanvas.getContext('2d');
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    return context;
  }


  /**
   * Call this after getRenderContext to finish rendering and have the source
   * of the canvas content returned as a data url string.
   */
  releaseRenderContext(): string {
    this._canvasAcquired = false;
    return this._renderCanvas.toDataURL();
  }

}
