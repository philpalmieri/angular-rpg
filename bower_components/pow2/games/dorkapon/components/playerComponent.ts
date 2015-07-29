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

///<reference path="../index.ts"/>

module dorkapon.components {

  /**
   * Basic Dorkapon player that can navigate around the map
   * using the paths defined within.
   */
  export class PlayerComponent extends pow2.scene.components.PlayerComponent {
    host:objects.DorkaponEntity;
    heading:pow2.Point = new pow2.Point(0, 1);
    paths:PlayerPathComponent = null;
    map:pow2.tile.TileMap = null;

    syncComponent():boolean {
      this.paths = <PlayerPathComponent>this.host.findComponent(PlayerPathComponent);
      return super.syncComponent();
    }

    /**
     * Collide with the A-star graph input data generated by a path component.
     */
    collideMove(x:number, y:number, results:pow2.scene.SceneObject[] = []) {
      if (this.host.scene && !this.map) {
        this.map = <pow2.tile.TileMap>this.host.scene.objectByType(pow2.tile.TileMap);
      }
      // If the tile is within the generated paths grid, check the
      // grid weight at the given position, and collide if it's value
      // is greater than some value.
      if (this.map && this.paths && this.map.bounds.pointInRect(x, y)) {
        return this.paths._graph.input[x][y] >= PathWeights.BLOCKED;
      }
      return false;
    }
  }
}