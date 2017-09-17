# TODO

- Add smarter way to bind HUD lines to data on the game object
- Don't select planet unless the onInputUp event occurs without any dragging in between
- Add military flagships by touching in military mode
- Add cost for maintaining links between planets

# BUGS

- Dragging between planets sometimes just doesn't register. Seems like something to do with the onInputOver event not firing, or maybe with game.hud.lastOverPlanet

# NOTES
- Can favor using paths instead of flagships by just making ship travel speed super slow. So you wouldn't want to micromanage