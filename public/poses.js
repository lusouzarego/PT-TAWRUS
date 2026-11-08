// Poses das animações (ver o formato em figura.js). Chave = id do exercício.
(function () {
  // Em pé, de lado, braços soltos.
  const stand = {
    hip: [0, 86], torso: 180,
    legL: { to: [-3, 4], bend: 1 }, legR: { to: [3, 4], bend: 1 },
    armL: { a: [-4, 4] }, armR: { a: [4, 8] },
  };
  // Em pé, de frente.
  const standFront = {
    hip: [0, 86], torso: 180,
    legL: { a: [-4, -3] }, legR: { a: [4, 3] },
    armL: { a: [-10, -6] }, armR: { a: [10, 6] },
  };
  const with_ = (base, extra) => Object.assign({}, base, extra);

  window.POSES = {
    // Agachamento goblet
    agach: {
      view: "side", props: { weights: true },
      frames: [
        with_(stand, { armL: { to: [10, 122], bend: -1 }, armR: { to: [12, 122], bend: -1 } }),
        with_(stand, {
          hip: [-26, 50], torso: 152,
          legL: { to: [-3, 4], bend: 1 }, legR: { to: [3, 4], bend: 1 },
          armL: { to: [12, 86], bend: -1 }, armR: { to: [14, 86], bend: -1 },
        }),
      ],
    },

    // Ponte de glúteo (deitada, cabeça à esquerda)
    ponte: {
      view: "side", props: { mat: true },
      frames: [
        {
          hip: [0, 11], torso: -90, head: -90,
          legL: { to: [36, 5], bend: 1 }, legR: { to: [40, 5], bend: 1 }, footL: 90, footR: 90,
          armL: { to: [-4, 5], bend: 1 }, armR: { to: [0, 5], bend: 1 },
        },
        {
          hip: [0, 40], torso: -62, head: -90,
          legL: { to: [36, 5], bend: 1 }, legR: { to: [40, 5], bend: 1 }, footL: 90, footR: 90,
          armL: { to: [-4, 5], bend: 1 }, armR: { to: [0, 5], bend: 1 },
        },
      ],
    },

    // Coice em quatro apoios (perna de perto chuta para cima)
    coice4: {
      view: "side", props: { mat: true },
      frames: [
        {
          hip: [0, 47], torso: 90, head: 100,
          legL: { a: [-2, -90] }, legR: { a: [2, -90] }, footL: -95, footR: -95,
          armL: { to: [50, 4], bend: -1 }, armR: { to: [54, 4], bend: -1 },
        },
        {
          hip: [0, 49], torso: 88, head: 100,
          legL: { a: [-2, -90] }, legR: { a: [-112, 175] }, footL: -95, footR: -90,
          armL: { to: [50, 4], bend: -1 }, armR: { to: [54, 4], bend: -1 },
        },
      ],
    },

    // Elevação lateral (de frente)
    elev_lat: {
      view: "front", props: { weights: true },
      frames: [
        standFront,
        with_(standFront, { armL: { a: [-84, -92] }, armR: { a: [84, 92] } }),
      ],
    },

    // Rosca bíceps
    rosca: {
      view: "side", props: { weights: true },
      frames: [
        with_(stand, { armL: { a: [2, 8] }, armR: { a: [4, 10] } }),
        with_(stand, { armL: { a: [2, 160] }, armR: { a: [4, 162] } }),
      ],
    },

    // Afundo reverso (perna de trás desce)
    afundo_rev: {
      view: "side", props: { weights: true },
      frames: [
        with_(stand, { legL: { to: [-2, 4], bend: 1 }, legR: { to: [2, 4], bend: 1 } }),
        with_(stand, {
          hip: [-30, 47],
          legR: { to: [2, 4], bend: 1 },
          legL: { to: [-78, 10], bend: 1 }, footL: 30,
          armL: { a: [-2, 2] }, armR: { a: [2, 4] },
        }),
      ],
    },
  };
})();
