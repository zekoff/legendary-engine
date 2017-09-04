module.exports = {
    planets: [
        { x: 150, y: 150, owner: null },
        { x: 250, y: 400, owner: "PLAYER" },
        { x: 200, y: 700, owner: null },
        { x: 500, y: 250, owner: null },
        { x: 550, y: 550, owner: null },
        { x: 800, y: 650, owner: "ENEMY" },
        { x: 750, y: 300, owner: null },
        { x: 1050, y: 200, owner: null },
        { x: 1000, y: 450, owner: null }
    ],
    links: [
        [0, 1],
        [1, 3],
        [1, 4],
        [2, 4],
        [3, 6],
        [4, 5],
        [5, 6],
        [5, 8],
        [6, 7]
    ]
};
