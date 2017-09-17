# TODO

- Add smarter way to bind HUD lines to data on the game object
- Don't select planet unless the onInputUp event occurs without any dragging in between
- Add military flagships by touching in military mode
- Add passive trade ships transporting between planets
- Add cost for maintaining links between planets

# BUGS

- Dragging between planets sometimes just doesn't register. Seems like something to do with the onInputOver event not firing, or maybe with game.hud.lastOverPlanet