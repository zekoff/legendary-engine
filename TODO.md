# TODO

- Add smarter way to bind HUD lines to data on the game object
- Don't select planet unless the onInputUp event occurs without any dragging in between
- Add military flagships by touching in military mode
- Add passive ships transporting between planets
- Add cost for maintaining links between planets
- Be able to remove links if one already exists

# BUGS

- Dragging between planets sometimes just doesn't register. Seems like something to do with the onInputOver event not firing, or maybe with game.hud.lastOverPlanet
- The visual of the arrow between planets uses the hard-coded start/end of each link to orient the arrow. The direction for purposes of ship movement uses the way the player drags their finger to create the link, however.