/* =========================================================================
   LO MONACO · Fuente única de datos de las maquetas (spec CRO v2, sección 5)
   Todo lo que se repite en la web sale de aquí: claims, teléfono, precios,
   menú y textos de producto. Ninguna página escribe estos valores a mano.

   estado:  'ok'         confirmado por Paco
            'confirmar'  dato de la web actual o del banner, sin validar
            'pendiente'  no hay dato: se pinta [[PENDIENTE: …]]

   Precios: foto de la Store API de WooCommerce del 28/10/2026.
   En WordPress se sustituyen por la lectura en vivo (/wp-json/wc/store/v1).
   ========================================================================= */
window.LM = window.LM || {};

LM.CONFIG = {
  telefono:     { v: '868 28 67 52', tel: '+34868286752', estado: 'ok' },
  horario:      { v: 'Lunes a viernes de 9:00 a 18:00', corto: 'L–V de 9:00 a 18:00', estado: 'ok' },
  prueba:       { v: '14 noches', estado: 'ok' },
  /* Garantía, devolución, envío y pago: textos de /devoluciones/, /envios/ y /metodos-de-pago/ (28/10/2026) */
  garantia:     { v: '10 años', estado: 'ok' },
  garantiaCubre:{ v: 'Cubre los defectos de fabricación y el núcleo del colchón (espuma, muelles o látex). No cubre manchas, humedad, golpes, mal uso, usarlo sin una base adecuada ni el asentamiento normal de las capas (hasta 2 cm).', estado: 'ok' },
  envio:        { v: 'Envío y montaje gratis en la península', estado: 'ok' },
  envioDevolucion: { v: 'Envío y montaje gratis', estado: 'ok' },
  devolucion:   { v: 'Lo recogemos en tu casa', estado: 'ok' },
  devolucionCond:{ v: 'Puedes devolverlo durante las 14 noches de prueba, desde que lo recibes. Debe estar en perfecto estado y con su embalaje original o uno parecido. Te devolvemos el dinero por transferencia en 10 días hábiles desde que llega a nuestro almacén. Se pueden descontar los gastos de envío y recogida cuando la ley lo permite.', estado: 'ok' },
  clientes:     { v: '750.000', estado: 'ok' },
  fundacion:    { v: '1977', estado: 'confirmar', nota: 'La web dice «desde 1977» y «más de 25 años»' },
  fabricacion:  { v: 'Fabricación propia en España', estado: 'confirmar' },
  entrega:      { v: '5 a 7 días laborables', estado: 'ok' },
  entregaMontaje:{ v: '20 a 25 días laborables', estado: 'confirmar', nota: 'Página de envíos: 20 a 25 días laborables; fichas de producto: 15 a 20 días' },
  financiacion: { v: '3 pagos sin intereses con SeQura', corto: '3 pagos sin intereses', meses: 3, factor: 1 / 3, estado: 'ok' },
  financiacionLarga: { v: null, estado: 'pendiente', nota: 'TAE y coste de cada plazo (4 a 18 meses)' },
  valoracion:   { media: '4,39', texto: 'Bueno', total: null, plataforma: 'Trusted Shops',
                  url: 'https://www.trustedshops.es/evaluacion/grupolomonaco-com', estado: 'confirmar',
                  nota: 'Nota de tu banner. Sustituir por el widget oficial de Trusted Shops (dinámico)' },
  medidaInicial:{ v: '150x190', estado: 'ok' },
  tiendas:      { v: null, estado: 'pendiente', nota: '¿Hay tiendas donde probarlo?' },
  durabilidad:  { v: null, estado: 'pendiente', nota: 'Dato y fuente de durabilidad (ensayo, años de vida útil…)' },
  precioRef:    { estado: 'confirmar', nota: 'El precio tachado debe ser el más bajo de los últimos 30 días' },
  videollamada: { v: 'Gratis y sin compromiso', estado: 'confirmar', nota: 'Condiciones del servicio Showroom Live' },
  videoCanales: { v: 'WhatsApp, Google Meet o llamada normal', estado: 'confirmar', nota: '¿Por qué canales haréis las videollamadas?' },
  videoDuracion:{ v: null, estado: 'pendiente', nota: 'duración aproximada de la videollamada' },
  agenda:       { v: null, estado: 'pendiente', nota: 'conectar con la agenda real del call center' },
  showroomDir:  { v: null, estado: 'pendiente', nota: 'dirección del showroom, si se puede visitar' },
  /* V4 · cambios de la home del 29/10 */
  cuotaBanner:  { v: '15 €', estado: 'confirmar', nota: 'Cuota del banner de Paco: falta la TAE y las condiciones (obligatorias en publicidad de financiación). La cuota confirmada es 3 pagos sin intereses' },
  trayectoria:  { v: 'Casi 30 años', estado: 'confirmar', nota: 'Choca con «Desde 1977» (casi 50 años). La web también dice «más de 25 años»' },
  compraGarantizada: { v: 'Protección al comprador de Trusted Shops', estado: 'confirmar', nota: 'Solo si el sello Trusted Shops Guarantee está activo' },
  financiacion36: { meses: 36, estado: 'confirmar', nota: 'Plazo máximo de 36 meses (Paco, 29/10). Falta la TAE y el coste: la cuota está calculada sin intereses, con el precio de la medida más pequeña' }
};

LM.WEB = 'https://www.grupolomonaco.com';

/* Menú: exactamente el del documento «Estructura SEO actual» (28/10/2026): textos y URLs finales.
   Única excepción con parámetros: los acabados del canapé (?attribute_pa_medidas=…&attribute_pa_color=…). */
LM.CANAPE_COLORES = [['Blanco', 'blanco'], ['Nórdico', 'nordico'], ['Roble', 'roble'], ['Nogal', 'nogal']];
LM.canapeColor = function (c) { return '/canape-abatible-de-madera/?attribute_pa_medidas=90-x-190-cm&attribute_pa_color=' + c; };
LM.MENU = [
  { t: 'Colchones', href: 'colchones.html', grupos: [
      { t: 'Tipos de colchones', links: [
        ['Colchones viscoelásticos', '/colchones-visco/'],
        ['Colchones látex', '/colchones-latex/'],
        ['Colchones muelles ensacados', '/colchones-muelles/']]},
      { t: 'Medidas principales', cols: 2, links: ['90x190','90x200','105x190','105x200','135x180','135x190','140x200','150x190','150x200','160x200','180x200','200x200']
          .map(function (m) { var a = m.split('x'); return ['Colchones ' + m, '/colchon-' + a[0] + '-x-' + a[1] + '/']; }) }
    ], destacados: ['gran', 'latex', 'gold', 'visco'] },
  { t: 'Canapé', href: '/canape/', grupos: [
      { t: 'Tipos de canapés', links: LM.CANAPE_COLORES.map(function (c) { return ['Canapé abatible ' + c[0], LM.canapeColor(c[1])]; }) },
      { t: 'Medidas', cols: 2, links: ['90x190','90x200','105x190','105x200','135x180','135x190','150x190','150x200','160x200','180x200','200x200']
          .map(function (m) { var a = m.split('x'); return ['Canapé abatible ' + m, '/canape-' + a[0] + '-x-' + a[1] + '/']; }) }
    ], fichas: ['canBlanco', 'canNordico', 'canRoble', 'canNogal'] },
  { t: 'Bases', href: '/bases/', grupos: [
      { t: 'Tipos de bases', links: [
        ['Base tapizada de tela', '/base-tapizada-de-tela/'],
        ['Base tapizada de tela 3D', '/base-tapizada-de-tela-3d/']]}
    ], fichas: ['base3d', 'baseTela'] },
  { t: 'Almohadas', href: '/almohadas/', grupos: [
      { t: 'Tipos de almohadas', links: [
        ['Almohada látex', '/almohada-latex-lomonaco/'],
        ['Almohada viscoelástica', '/almohada-visco/']]},
      { t: 'Medidas principales', links: [
        ['Almohada 70 cm', '/almohadas-70/'], ['Almohada 75 cm', '/almohadas-75/'],
        ['Almohada 90 cm', '/almohadas-90/'], ['Almohada 135 cm', '/almohadas-135/']]}
    ], fichas: ['almLatex', 'almVisco'] },
  { t: 'Complementos', href: '/otros/', grupos: [
      { t: 'Complementos', links: [
        ['Sábana bajera', '/bajera-impermeable/'],
        ['Edredón nórdico', '/edredon-nordico/']]}
    ], fichas: ['bajera', 'edredon'] }
];
// 29/10: el botón rojo del menú lleva a la ficha de pack de la maqueta (Natura Gold, el más vendido)
LM.MENU_PACKS = { t: 'Packs colchón + canapé o base', href: 'pack-natura-gold.html' };

/* Medidas en el orden de la web */
LM.MEDIDAS = ['90x190','90x200','105x190','105x200','135x180','135x190','140x200','150x190','150x200','160x200','180x200','200x200'];

/* Precios por medida: id de variación, precio (p), precio de referencia (r), stock (s) */
LM.PRECIOS = {"visco":{"90x190":{"id":41677,"p":449.49,"r":749.15,"s":true},"90x200":{"id":41678,"p":556.0,"r":926.67,"s":true},"105x190":{"id":41679,"p":582.0,"r":970.0,"s":true},"105x200":{"id":41680,"p":614.99,"r":1025.0,"s":true},"135x180":{"id":41714,"p":670.0,"r":1116.67,"s":true},"135x190":{"id":41681,"p":670.0,"r":1116.67,"s":true},"140x200":{"id":41682,"p":714.0,"r":1190.0,"s":true},"150x190":{"id":41683,"p":714.0,"r":1190.0,"s":true},"150x200":{"id":41684,"p":765.0,"r":1275.0,"s":true},"160x200":{"id":41685,"p":846.0,"r":1410.0,"s":true},"180x200":{"id":41686,"p":930.01,"r":1550.0,"s":true},"200x200":{"id":41687,"p":1044.0,"r":1740.0,"s":true}},"gold":{"90x190":{"id":41645,"p":637.0,"r":1274.0,"s":true},"90x200":{"id":41646,"p":670.0,"r":1340.0,"s":true},"105x190":{"id":41647,"p":692.0,"r":1384.0,"s":true},"105x200":{"id":41648,"p":732.0,"r":1464.0,"s":true},"135x180":{"id":41649,"p":791.0,"r":1582.0,"s":true},"135x190":{"id":41650,"p":791.0,"r":1582.0,"s":true},"140x200":{"id":41713,"p":842.0,"r":1684.01,"s":true},"150x190":{"id":41651,"p":842.0,"r":1684.01,"s":true},"150x200":{"id":41652,"p":890.0,"r":1779.99,"s":true},"160x200":{"id":41653,"p":1062.0,"r":2124.0,"s":true},"180x200":{"id":41654,"p":1172.01,"r":2344.0,"s":true},"200x200":{"id":41655,"p":1264.0,"r":2528.0,"s":true}},"latex":{"90x190":{"id":41659,"p":842.0,"r":2105.0,"s":true},"90x200":{"id":41660,"p":890.0,"r":2225.0,"s":true},"105x190":{"id":41661,"p":945.0,"r":2362.5,"s":true},"105x200":{"id":41662,"p":1000.0,"r":2500.01,"s":true},"135x180":{"id":41663,"p":1077.0,"r":2692.5,"s":true},"135x190":{"id":41664,"p":1077.0,"r":2692.5,"s":true},"140x200":{"id":41731,"p":1150.0,"r":2875.0,"s":true},"150x190":{"id":41665,"p":1150.0,"r":2875.0,"s":true},"150x200":{"id":41666,"p":1216.0,"r":3040.0,"s":true},"160x200":{"id":41667,"p":1447.0,"r":3617.5,"s":true},"180x200":{"id":41668,"p":1550.0,"r":3875.0,"s":true},"200x200":{"id":41669,"p":1733.0,"r":4332.5,"s":true}},"gran":{"90x190":{"id":68499,"p":1044.0,"r":2088.0,"s":true},"90x200":{"id":68500,"p":1134.0,"r":2268.0,"s":true},"105x190":{"id":68501,"p":1178.0,"r":2356.0,"s":true},"105x200":{"id":68502,"p":1281.0,"r":2562.01,"s":true},"135x180":{"id":68503,"p":1389.0,"r":2778.0,"s":true},"135x190":{"id":68504,"p":1512.0,"r":3024.0,"s":true},"150x190":{"id":68506,"p":1505.0,"r":3010.0,"s":true},"150x200":{"id":68507,"p":1643.0,"r":3286.0,"s":true},"160x200":{"id":68508,"p":1900.0,"r":3800.01,"s":true},"180x200":{"id":68509,"p":1973.0,"r":3946.0,"s":true},"200x200":{"id":68510,"p":2246.99,"r":4494.0,"s":true}},"latexCanape":{"135x180":{"id":73415,"p":1637.0,"r":4554.5,"s":true},"90x190":{"id":64602,"p":1299.0,"r":3456.99,"s":true},"90x200":{"id":64605,"p":1368.99,"r":3621.0,"s":true},"105x190":{"id":64608,"p":1428.01,"r":3786.5,"s":true},"105x200":{"id":64611,"p":1501.01,"r":3960.0,"s":true},"135x190":{"id":64614,"p":1622.01,"r":4359.5,"s":true},"150x190":{"id":64620,"p":1717.0,"r":4675.5,"s":true},"150x200":{"id":64623,"p":1805.01,"r":4884.5,"s":true},"160x200":{"id":64626,"p":2102.0,"r":5579.0,"s":true},"180x200":{"id":64631,"p":2517.01,"r":6531.0,"s":true},"200x200":{"id":64628,"p":2820.99,"r":7294.5,"s":true}},"latexBase":{"90x190":{"id":73425,"p":1050.0,"r":3012.33,"s":true},"90x200":{"id":73427,"p":1115.0,"r":3166.33,"s":true},"105x190":{"id":73429,"p":1167.0,"r":3323.39,"s":true},"105x200":{"id":73431,"p":1240.0,"r":3496.89,"s":true},"135x190":{"id":73433,"p":1319.0,"r":3918.5,"s":true},"140x200":{"id":73663,"p":1427.0,"r":4175.44,"s":true},"150x190":{"id":73435,"p":1405.0,"r":4153.44,"s":true},"150x200":{"id":73437,"p":1493.0,"r":4362.44,"s":true},"160x200":{"id":73439,"p":1743.0,"r":4983.5,"s":true},"180x200":{"id":73441,"p":1978.0,"r":5538.56,"s":true},"200x200":{"id":73443,"p":2192.0,"r":6132.06,"s":true}},"viscoCanape":{"90x190":{"id":73611,"p":984.0,"r":1936.92,"s":true},"90x200":{"id":73615,"p":1035.0,"r":2029.25,"s":true},"105x190":{"id":73619,"p":1065.0,"r":2086.14,"s":true},"105x200":{"id":73623,"p":1116.0,"r":2177.14,"s":true},"135x180":{"id":73627,"p":1230.0,"r":2489.17,"s":true},"135x190":{"id":73632,"p":1215.0,"r":2459.17,"s":true},"150x190":{"id":73635,"p":1281.0,"r":2580.94,"s":true},"150x200":{"id":73639,"p":1354.0,"r":2709.94,"s":true},"160x200":{"id":73643,"p":1501.0,"r":2982.5,"s":true},"180x200":{"id":73647,"p":1897.0,"r":3752.06,"s":true},"200x200":{"id":73651,"p":2132.0,"r":4194.06,"s":true}},"viscoBase":{"90x190":{"id":73468,"p":735.0,"r":1438.92,"s":true},"90x200":{"id":73470,"p":781.0,"r":1521.25,"s":true},"105x190":{"id":73472,"p":804.0,"r":1564.14,"s":true},"105x200":{"id":73474,"p":855.0,"r":1655.14,"s":true},"135x190":{"id":73476,"p":912.0,"r":1853.17,"s":true},"140x200":{"id":73674,"p":991.0,"r":2000.94,"s":true},"150x190":{"id":73478,"p":969.0,"r":1956.94,"s":true},"150x200":{"id":73480,"p":1042.0,"r":2085.94,"s":true},"160x200":{"id":73483,"p":1142.0,"r":2264.5,"s":true},"180x200":{"id":73484,"p":1358.0,"r":2674.06,"s":true},"200x200":{"id":73486,"p":1503.0,"r":2936.06,"s":true}},"goldCanape":{"90x190":{"id":73601,"p":1094.0,"r":2620.58,"s":true},"90x200":{"id":73604,"p":1149.0,"r":2730.58,"s":true},"105x190":{"id":73569,"p":1175.0,"r":2808.14,"s":true},"105x200":{"id":73572,"p":1233.0,"r":2924.14,"s":true},"135x180":{"id":73576,"p":1351.0,"r":3326.5,"s":true},"135x190":{"id":73497,"p":1336.0,"r":3296.5,"s":true},"150x190":{"id":73586,"p":1409.0,"r":3468.94,"s":true},"150x200":{"id":73589,"p":1479.0,"r":3608.94,"s":true},"160x200":{"id":73592,"p":1717.0,"r":4090.5,"s":true},"180x200":{"id":73595,"p":2139.0,"r":4968.06,"s":true},"200x200":{"id":73598,"p":2352.0,"r":5468.06,"s":true}},"goldBase":{"90x190":{"id":73447,"p":845.0,"r":2122.58,"s":true},"90x200":{"id":73449,"p":895.0,"r":2222.58,"s":true},"105x190":{"id":73451,"p":914.0,"r":2286.14,"s":true},"105x200":{"id":73453,"p":972.0,"r":2402.14,"s":true},"135x190":{"id":73455,"p":1033.0,"r":2690.5,"s":true},"140x200":{"id":73664,"p":1119.0,"r":2866.94,"s":true},"150x190":{"id":73457,"p":1097.0,"r":2844.94,"s":true},"150x200":{"id":73459,"p":1167.0,"r":2984.94,"s":true},"160x200":{"id":73461,"p":1358.0,"r":3372.5,"s":true},"180x200":{"id":73463,"p":1600.01,"r":3484.06,"s":true},"200x200":{"id":73465,"p":1723.0,"r":4210.06,"s":true}},"granCanape":{"90x190":{"id":69134,"p":1501.01,"r":3440.01,"s":true},"90x200":{"id":69137,"p":1613.0,"r":3664.0,"s":true},"105x190":{"id":69140,"p":1661.0,"r":3780.0,"s":true},"105x200":{"id":69143,"p":1782.0,"r":4022.0,"s":true},"135x180":{"id":69171,"p":1949.0,"r":4475.0,"s":true},"135x190":{"id":69146,"p":2057.0,"r":4691.0,"s":true},"150x190":{"id":69149,"p":2072.0,"r":4810.5,"s":true},"150x200":{"id":69152,"p":2232.0,"r":5130.5,"s":true},"160x200":{"id":69155,"p":2555.0,"r":5761.5,"s":true},"180x200":{"id":69158,"p":2940.0,"r":6602.0,"s":true},"200x200":{"id":69161,"p":3335.0,"r":7456.0,"s":true}},"granBase":{"90x190":{"id":72446,"p":1252.0,"r":2995.33,"s":true},"90x200":{"id":72449,"p":1359.0,"r":3209.33,"s":true},"105x190":{"id":73550,"p":1400.0,"r":3316.89,"s":true},"105x200":{"id":72456,"p":1521.0,"r":3558.89,"s":true},"135x190":{"id":72458,"p":1754.0,"r":4250.0,"s":true},"150x190":{"id":72461,"p":1760.0,"r":4288.44,"s":true},"150x200":{"id":72464,"p":1920.0,"r":4608.44,"s":true},"160x200":{"id":72467,"p":2196.0,"r":5166.0,"s":true},"180x200":{"id":72470,"p":2401.0,"r":5609.56,"s":true},"200x200":{"id":72473,"p":2706.0,"r":6293.56,"s":true}}};

/* Colchones: datos de la web actual (altura, firmeza, adaptabilidad, capas).
   Los textos de «para quién» son redacción nueva a partir de las fichas: validar. */
LM.PRODUCTOS = {
  visco: {
    pagina: 'colchon-natura-visco.html',
    packs: { canape: { pid: 73610, tabla: 'viscoCanape', d: 'Canapé abatible + almohadas, edredón y protector de regalo', img: '../img/pack-visco-canape-760.webp' },
             base: { pid: 73467, tabla: 'viscoBase', d: 'Base tapizada + almohadas, edredón y protector de regalo', img: '../img/base-3d-760.webp' } },
    vp: 'Viscoelástica con un núcleo firme. Se adapta a la forma de tu cuerpo y te da un soporte firme y silencioso.',
    beneficios: [['shield', 'Soporte firme', 'El núcleo HR reparte tu peso y cuida tu postura.'],
                 ['body', 'Se adapta a ti', 'La visco se amolda a tu forma y alivia la presión.'],
                 ['thermo', 'Temperatura agradable', 'La fibra termorreguladora te ayuda a no pasar frío ni calor.'],
                 ['couple', 'No notas a tu pareja', 'Si tu pareja se gira, tu lado apenas se mueve.']],
    sensacionLarga: 'Es un colchón firme: notas que te sujeta. La capa de visco te acoge un poco al tumbarte.',
    durTxt: 'El núcleo HR es un soporte firme pensado para mantener su forma.',
    id: 41676, nombre: 'Natura Visco', titulo: 'Colchón Natura Visco', url: 'colchon-natura-visco.html',
    img: '../img/natura-visco-nueva-560.webp', foto: 'nueva', fotoNueva: '../img/natura-visco-nueva', imgDetalle: '../img/natura-latex-06-560.webp', 
    etiqueta: 'Gran soporte', nucleo: 'Viscoelástica', tipo: 'visco', altura: '28 cm',
    firmeza: 85, adaptabilidad: 70, sensacion: 'firme',
    sensacionTxt: 'Firme y estable. Notas que el colchón te sujeta.',
    diferencia: 'Soporte firme y silencioso, y el precio más bajo de la gama.',
    paraQuien: 'Para ti si te gusta dormir sobre algo firme.',
    nucleoTxt: 'Viscoelástica: se adapta a la forma de tu cuerpo y reparte el peso.',
    capas: [['Fibra termorreguladora', 'Mantiene una temperatura agradable, en verano y en invierno.'],
            ['Visco', 'Se adapta a tu cuerpo y alivia la presión.'],
            ['HR extra adaptable', 'Acompaña cada movimiento con comodidad.'],
            ['Núcleo HR', 'Un soporte firme que cuida tu postura.']] },
  gold: {
    pagina: 'colchon-natura-gold.html',
    packs: { canape: { pid: 73488, tabla: 'goldCanape', d: 'Canapé abatible + almohadas, edredón y protector de regalo', img: '../img/pack-gold-canape-760.webp' },
             base: { pid: 73446, tabla: 'goldBase', d: 'Base tapizada + almohadas, edredón y protector de regalo', img: '../img/base-3d-760.webp' } },
    vp: 'Muelles ensacados con visco. Firmeza media: te acoge, te sujeta y apenas notas a tu pareja.',
    beneficios: [['couple', 'No notas a tu pareja', 'Cada muelle trabaja solo y reduce los movimientos.'],
                 ['body', 'Te acoge', 'La visco alivia la presión en hombros y caderas.'],
                 ['waves', 'Ventilación continua', 'Los muelles dejan pasar el aire por dentro del colchón.'],
                 ['thermo', 'Temperatura constante', 'La fibra termorreguladora se adapta al frío y al calor.']],
    sensacionLarga: 'Ni duro ni blando: tiene la misma firmeza que adaptabilidad. Te acoge al tumbarte y te sujeta toda la noche.',
    durTxt: 'Los muelles ensacados reparten tu peso de forma uniforme y mantienen tu postura.',
    id: 41644, nombre: 'Natura Gold', titulo: 'Colchón Natura Gold', url: 'colchon-natura-gold.html',
    img: '../img/natura-gold-nueva-560.webp', foto: 'nueva', fotoNueva: '../img/natura-gold-nueva', imgDetalle: '../img/natura-latex-06-560.webp', 
    etiqueta: 'El más vendido', nucleo: 'Muelles ensacados + visco', tipo: 'muelles', altura: '30 cm',
    firmeza: 80, adaptabilidad: 80, sensacion: 'equilibrada',
    sensacionTxt: 'Ni duro ni blando. Te acoge y te sujeta a la vez.',
    diferencia: 'Muelles que trabajan uno a uno: si tu pareja se mueve, apenas lo notas.',
    paraQuien: 'Para ti si duermes en pareja.',
    nucleoTxt: 'Muelles ensacados: cada muelle trabaja solo, así no notas los movimientos de tu pareja.',
    capas: [['Fibra termorreguladora', 'Temperatura constante toda la noche.'],
            ['Visco', 'Sensación envolvente que alivia hombros y caderas.'],
            ['HR extra confort', 'Reparte tu peso de forma uniforme.'],
            ['Muelles ensacados', 'Soporte a tu medida y menos movimiento.']] },
  latex: {
    pagina: 'colchon-natura-latex.html',
    packs: { canape: { pid: 64601, tabla: 'latexCanape', d: 'Canapé abatible + almohadas, edredón y protector de regalo', img: '../img/pack-latex-canape-760.webp' },
             base: { pid: 73424, tabla: 'latexBase', d: 'Base tapizada + almohadas, edredón y protector de regalo', img: '../img/pack-latex-base-760.webp' } },
    fotosPropias: true,
    vp: 'Látex natural sobre muelles ensacados. Te recibe suave, te sujeta bien y no pasas calor.',
    beneficios: [['waves', 'No pasas calor', 'El tejido y el látex dejan pasar el aire. La superficie se mantiene fresca.'],
                 ['body', 'Se adapta a tu cuerpo', 'El látex se amolda a hombros y cadera y recupera su forma en cuanto te mueves.'],
                 ['couple', 'No notas a tu pareja', 'Cada muelle trabaja solo. Si tu pareja se gira, tu lado sigue quieto.'],
                 ['leaf', 'Hipoalergénico', 'El látex natural es hipoalergénico y transpirable.']],
    sensacionLarga: 'Es el más acogedor de nuestros cuatro colchones: tiene la firmeza más baja de la gama. Notas que te recibe suave y, debajo, que los muelles te sujetan.',
    durTxt: 'El látex recupera su forma después de cada noche: así evitas que se hunda donde duermes.',
    id: 41658, nombre: 'Natura Látex', titulo: 'Colchón Natura Látex', url: 'colchon-natura-latex.html',
    img: '../img/natura-latex-nueva-560.webp', foto: 'nueva', fotoNueva: '../img/natura-latex-nueva', imgDetalle: '../img/natura-latex-02-560.webp',
    etiqueta: 'Efecto nube', nucleo: 'Muelles ensacados + látex', tipo: 'latex', altura: '32 cm',
    firmeza: 75, adaptabilidad: 85, sensacion: 'acogedora',
    sensacionTxt: 'La más acogedora de la gama. Te recibe suave y te sujeta bien.',
    diferencia: 'Látex natural sobre muelles ensacados: fresco, suave y con soporte.',
    paraQuien: 'Para ti si pasas calor o te gusta una tumbada suave.',
    nucleoTxt: 'Látex: el colchón recupera su forma enseguida y deja pasar el aire.',
    capas: [['Tejido transpirable', 'La superficie se mantiene fresca en cualquier época del año.'],
            ['Látex natural', 'Una capa suave que te acoge al tumbarte. Hipoalergénica y transpirable.'],
            ['Algodón', 'Más frescor y suavidad. Ayuda a regular la humedad.'],
            ['Muelles ensacados', 'Cada muelle trabaja solo: soporte a tu medida y no notas a tu pareja.']] },
  gran: {
    pagina: 'colchon-gran-natura.html',
    packs: { canape: { pid: 69133, tabla: 'granCanape', d: 'Canapé abatible + almohadas, edredón y protector de regalo', img: '../img/pack-gran-natura-canape-760.webp' },
             base: { pid: 72445, tabla: 'granBase', d: 'Base tapizada + almohadas, edredón y protector de regalo', img: '../img/base-3d-760.webp' } },
    vp: 'Núcleo 100% látex. Se adapta a todo tu cuerpo y reduce la presión en hombros, espalda y cadera.',
    beneficios: [['body', '100% adaptable', 'El látex reduce la presión en hombros, espalda y cadera.'],
                 ['couple', 'No notas a tu pareja', 'Si tu pareja se gira o se levanta, tu lado sigue quieto.'],
                 ['waves', 'Frescor', 'Deja pasar el aire y expulsa el calor y la humedad.'],
                 ['leaf', 'Hipoalergénico', '100% látex, hipoalergénico y antibacteriano.']],
    sensacionLarga: 'Firme, pero se adapta a todo tu cuerpo. Desde la primera noche notas una acogida suave.',
    durTxt: 'El látex recupera su forma después de cada noche: así evitas que se hunda donde duermes.',
    id: 68498, nombre: 'Gran Natura', titulo: 'Colchón Gran Natura', url: 'colchon-gran-natura.html',
    img: '../img/gran-natura-nueva-560.webp', foto: 'nueva', fotoNueva: '../img/gran-natura-nueva', imgDetalle: '../img/natura-latex-06-560.webp', 
    etiqueta: '100% adaptable', nucleo: '100% látex', tipo: 'latex', altura: '25 cm', /* Paco, 29/10: 25 cm (antes 26–30) */
    firmeza: 85, adaptabilidad: 100, sensacion: 'firme',
    sensacionTxt: 'Firme pero se adapta a todo tu cuerpo.',
    diferencia: 'Núcleo 100% látex: el más adaptable de la gama.',
    paraQuien: 'Para ti si quieres un colchón 100% látex para muchos años.',
    nucleoTxt: 'Látex: el colchón recupera su forma enseguida y dura más años.',
    entrega: '15 a 20 días',
    capas: [['Tejido Damastretch', 'Funda suave y elástica.'],
            ['Núcleo 100% látex', 'Soporte estable y transpirable.'],
            ['Independencia de lechos', 'Si tu pareja se gira, tu lado sigue quieto.'],
            ['Termorregulación', 'Deja pasar el aire y expulsa el calor.']] }
};
LM.ORDEN = ['visco', 'gold', 'latex', 'gran'];

/* Packs (categoría /packs/ de la web actual) */
LM.PACKS = [
  { n: 'Pack Natura Visco + canapé', inc: 'Colchón, canapé, almohadas y bajera', p: 984, r: 1936.92, img: '../img/pack-visco-canape-760.webp', url: '/pack-colchon-natura-visco-canape-almohadas-bajera/' },
  { n: 'Pack Natura Gold + canapé', inc: 'Colchón, canapé, almohadas, bajera y edredón', p: 1094, r: 2620.58, img: '../img/pack-gold-canape-760.webp', url: '/pack-colchon-natura-gold-y-canape-almohadas-bajera-edredon/' },
  { n: 'Pack Natura Látex + canapé', inc: 'Colchón, canapé, almohadas, bajera y edredón', p: 1299, r: 3456.99, img: '../img/pack-latex-canape-760.webp', url: '/pack-colchon-y-canape-almohadas-bajera-edredon/' },
  { n: 'Pack Gran Natura + canapé', inc: 'Colchón, canapé, almohadas, bajera y edredón', p: 1501.01, r: 3440.01, img: '../img/pack-gran-natura-canape-760.webp', url: '/pack-colchon-gran-natura-y-canape-almohadas-bajera-edredon/' },
  { n: 'Pack Natura Látex + base', inc: 'Colchón y base tapizada antideslizante', p: 1050, r: 3012.33, img: '../img/pack-latex-base-760.webp', url: '/pack-colchon-natura-latex-base-tapizada-antideslizante/' }
];

/* Fichas cortas del menú y de venta cruzada */
LM.FICHAS = {
  canape:   { n: 'Canapé abatible de madera', d: 'Cuatro acabados de madera', p: 457, r: 914, img: '../img/canape-760.webp', url: '/canape-abatible-de-madera/' },
  canBlanco:  { n: 'Canapé abatible Blanco', d: 'Acabado blanco', p: 457, r: 914, img: '../img/canape-760.webp', url: LM.canapeColor('blanco') },
  canNordico: { n: 'Canapé abatible Nórdico', d: 'Acabado nórdico', p: 457, r: 914, img: '../img/canape-760.webp', url: LM.canapeColor('nordico') },
  canRoble:   { n: 'Canapé abatible Roble', d: 'Acabado roble', p: 457, r: 914, img: '../img/canape-760.webp', url: LM.canapeColor('roble') },
  canNogal:   { n: 'Canapé abatible Nogal', d: 'Acabado nogal', p: 457, r: 914, img: '../img/canape-760.webp', url: LM.canapeColor('nogal') },
  base3d:   { n: 'Base tapizada de tela 3D anti.', d: 'Patas incluidas', p: 208, r: 416, img: '../img/base-3d-760.webp', url: '/base-tapizada-de-tela-3d/' },
  baseTela: { n: 'Base tapizada de tela', d: 'Tapizado en tela', p: 336, r: 672, img: '../img/base-tela-760.webp', url: '/base-tapizada-de-tela/' },
  almLatex: { n: 'Almohada Látex', d: 'Ideal si duermes de lado', p: 103, r: 128.74, img: '../img/almohada-latex-760.webp', url: '/almohada-latex-lomonaco/' },
  almVisco: { n: 'Almohada ViscoAir', d: 'Alivia la presión en el cuello', p: 65, r: 81.25, img: '../img/almohada-visco-760.webp', url: '/almohada-visco/' },
  bajera:   { n: 'Sábana bajera impermeable', d: 'Tejido tencel transpirable', p: 48, r: 53.34, img: null, url: '/bajera-impermeable/' },
  edredon:  { n: 'Edredón nórdico Duo Rest', d: 'Doble capa, para todo el año', p: 144, r: 288, img: null, url: '/edredon-nordico/' }
};
LM.RECOGIDA = { id: 9815, n: 'Nos llevamos tu colchón viejo', p: 49.01 };

/* Opiniones reales de la web actual (clientes verificados), sin duplicados.
   En la web son opiniones de la tienda, no de un modelo concreto. */
LM.RESENAS = [
  { t: '18 años descansando como un rey', f: '8 sep 2026', m: 'Gran Natura',
    x: 'Mi anterior colchón fue Lomonaco y he descansado durante 18 años como un rey. Y por supuesto he vuelto a comprar otro.' },
  { t: 'Excelente trato y calidad', f: '15 ene 2026', m: 'Natura Gold',
    x: 'Se descansa tan bien que incluso me levanto antes de que suene la alarma.' },
  { t: 'Justo lo que buscaba', f: '23 jun 2026',
    x: 'Perfecto, lo que yo estaba buscando: un colchón que se adapta y me hace descansar perfectamente.' },
  { t: null, f: '26 dic 2025',
    x: 'La mejor compra de mi vida, colchón cómodo de buena calidad.' },
  { t: null, f: '1 nov 2025',
    x: 'Es el tercer colchón que compro para todos (matrimonio 180 por 200 y dos más pequeños para los niños). Sinceramente, estoy encantada.' },
  { t: null, f: '29 oct 2025',
    x: 'El colchón es muy cómodo. Hacía mucho tiempo que no me acostaba y tenía que buscar la postura para poder dormir bien.' },
  { t: null, f: '17 oct 2025',
    x: 'La atención muy buena, el reparto 10 días antes de lo previsto y el montaje muy eficaz.' }
];

/* Contenido UGC: Shorts de YouTube del canal de Lo Monaco (se cargan al pulsar) */
LM.UGC = [
  { id: '5k6t2Fz1Ldk', autor: 'Nosinmicapota' },
  { id: 'rxloHy_pT5g', autor: 'Yoryina' },
  { id: 'AclN4U_mhzA', autor: 'Ana Albadalejo' },
  { id: 'jOycSLqKcig', autor: '1000manerasdevestir' }
];

/* Showroom Live: escenas del visor (fotos IMG_7033–7037) y camas.
   Posiciones en % de la foto. Modelos leídos en las etiquetas de cada colchón. */
LM.SHOWROOM = {
  camas: {
    gold:  { k: 'gold',  t: 'Natura Gold', donde: 'Cabecero tapizado gris y canapé de madera clara', img: '../img/showroom-7034-1400.webp' },
    latex: { k: 'latex', t: 'Natura Látex', donde: 'Cabecero oscuro y canapé de madera nogal', img: '../img/showroom-detalle-7031.webp' },
    gran:  { k: 'gran',  t: 'Gran Natura', donde: 'Cabecero oscuro y canapé blanco', img: '../img/showroom-7036-1400.webp' },
    almohadas: { t: 'Almohadas y edredón', donde: 'Estantería de complementos', img: '../img/almohada-latex-760.webp', url: '/almohadas/' }
  },
  escenas: [
    { id: 7033, t: 'Entrada', mapa: [18, 88, -35], puntos: [['gold', 29, 64], ['latex', 57, 58], ['gran', 77, 57], ['almohadas', 85, 40]] },
    { id: 7034, t: 'Junto al Natura Gold', mapa: [26, 70, -40], puntos: [['gold', 33, 66], ['latex', 67, 53], ['gran', 82, 50], ['almohadas', 81, 30]] },
    { id: 7035, t: 'De frente', mapa: [50, 86, 0], puntos: [['gold', 15, 62], ['latex', 56, 62], ['gran', 89, 62]] },
    { id: 7036, t: 'Zona Gran Natura', mapa: [68, 78, 5], puntos: [['latex', 12, 63], ['gran', 54, 68], ['almohadas', 82, 48]] },
    { id: 7037, t: 'Desde el rincón', mapa: [90, 70, 40], puntos: [['gran', 63, 78], ['latex', 32, 53], ['gold', 18, 44]] }
  ],
  detalles: [
    [7031, 'La etiqueta del Natura Látex'], [7022, 'El acolchado, de cerca'], [7027, 'El lateral y su etiqueta'],
    [7032, 'La cinta Lo Monaco'], [7012, 'El borde acolchado'], [7010, 'Colchón y canapé']
  ]
};

/* V4 · Reseñas cortas del hero (carrusel). Solo opiniones reales de LM.RESENAS, salvo la del banner de Paco */
LM.HERO_RESENAS = [
  { x: 'La mejor compra que he hecho hasta el momento', estado: 'confirmar', nota: 'Texto del banner de Paco. La reseña real dice «La mejor compra de mi vida, colchón cómodo de buena calidad»' },
  { x: '18 años descansando como un rey', estado: 'ok' },
  { x: 'Se descansa tan bien que incluso me levanto antes de que suene la alarma', estado: 'ok' },
  { x: 'Justo lo que buscaba', estado: 'ok' }
];

/* V4 · Configurador de packs: los 8 packs reales de la tienda (colchón × canapé o base).
   Contenido según el NOMBRE de cada pack en la tienda; la descripción de la tienda promete
   almohadas, protector y edredón en todos: pendiente de confirmar. */
LM.PACK_CONF = {
  bases: {
    canape: { t: 'Con canapé', img: '../img/pack-conf-canape', alt: 'Colchón Lomonaco sobre canapé abatible de madera, con almohadas, bajera y edredón' },
    /* Base tapizada de tela (16379): en la tienda NO hay pack con ella → sin precio inventado */
    tela:   { t: 'Con base tapizada', img: '../img/pack-conf-base', alt: 'Colchón Lomonaco sobre base tapizada de tela, con almohadas y bajera', sinPack: true },
    /* Los 4 packs «+ Base tapizada antideslizante» de la tienda son esta base, con patas (30 cm según Paco) */
    base:   { t: 'Con base antideslizante', img: '../img/pack-conf-patas', alt: 'Colchón Lomonaco sobre base tapizada antideslizante con patas' }
  },
  orden: ['canape', 'tela', 'base'],
  colchones: [
    { k: 'gran',   t: 'Gran Natura',  d: '100% látex' },
    { k: 'latex',  t: 'Natura Látex', d: 'Muelles + látex' },
    { k: 'gold',   t: 'Natura Gold',  d: 'Muelles + visco' },
    { k: 'visco',  t: 'Natura Visco', d: 'Viscoelástica' }
  ],
  packs: {
    granCanape:  { pid: 69133, inc: ['Canapé abatible de madera', 'Almohadas de regalo', 'Edredón de regalo', 'Protector de colchón de regalo'], url: '/pack-colchon-gran-natura-y-canape-almohadas-bajera-edredon/' },
    latexCanape: { pid: 64601, inc: ['Canapé abatible de madera', 'Almohadas de regalo', 'Edredón de regalo', 'Protector de colchón de regalo'], url: '/pack-colchon-y-canape-almohadas-bajera-edredon/' },
    goldCanape:  { pid: 73488, inc: ['Canapé abatible de madera', 'Almohadas de regalo', 'Edredón de regalo', 'Protector de colchón de regalo'], url: '/pack-colchon-natura-gold-y-canape-almohadas-bajera-edredon/' },
    viscoCanape: { pid: 73610, inc: ['Canapé abatible de madera', 'Almohadas de regalo', 'Edredón de regalo', 'Protector de colchón de regalo'], url: '/pack-colchon-natura-visco-canape-almohadas-bajera/' },
    granBase:    { pid: 72445, inc: ['Base tapizada antideslizante con patas de 30 cm', 'Almohadas de regalo', 'Edredón de regalo', 'Protector de colchón de regalo'], url: '/pack-colchon-gran-natura-y-base-tapizada-antideslizante/' },
    latexBase:   { pid: 73424, inc: ['Base tapizada antideslizante con patas de 30 cm', 'Almohadas de regalo', 'Edredón de regalo', 'Protector de colchón de regalo'], url: '/pack-colchon-natura-latex-base-tapizada-antideslizante/' },
    goldBase:    { pid: 73446, inc: ['Base tapizada antideslizante con patas de 30 cm', 'Almohadas de regalo', 'Edredón de regalo', 'Protector de colchón de regalo'], url: '/pack-colchon-natura-gold-base-tapizada-antideslizante/' },
    viscoBase:   { pid: 73467, inc: ['Base tapizada antideslizante con patas de 30 cm', 'Almohadas de regalo', 'Edredón de regalo', 'Protector de colchón de regalo'], url: '/pack-colchon-natura-visco-base-tapizada-antideslizante/' }
  }
};

/* Categoría · comentario 4 (29/10): palabras clave en globos LM y pictogramas (Opción B).
   Todo sale de los datos reales de cada colchón (capas y beneficios de la web actual). */
LM.CAT_EXTRA = {
  visco: { claves: ['Firme', 'Viscoelástica', 'Termorregulador'],
           pictos: [['shield', 'Soporte firme'], ['body', 'Se adapta a ti'], ['thermo', 'Temperatura agradable']] },
  gold:  { claves: ['Muelles ensacados', 'Firmeza media', 'Ideal en pareja'],
           pictos: [['couple', 'No notas a tu pareja'], ['body', 'Te acoge'], ['waves', 'Ventilación continua'], ['thermo', 'Temperatura constante']] },
  latex: { claves: ['Látex natural', 'Muelles ensacados', 'Fresco', 'Hipoalergénico'],
           pictos: [['waves', 'No pasas calor'], ['body', 'Se adapta a tu cuerpo'], ['couple', 'No notas a tu pareja'], ['leaf', 'Hipoalergénico'], ['moon', 'Tumbada suave']] },
  gran:  { claves: ['100% látex', '100% adaptable', 'Hipoalergénico', 'Frescor', 'Independencia de lechos'],
           pictos: [['body', '100% adaptable'], ['couple', 'Independencia de lechos'], ['waves', 'Frescor'], ['leaf', 'Hipoalergénico'], ['shield', 'Antibacteriano'], ['ruler', '25 cm de altura']] }
};

/* Categoría · Opción B (29/10): filtros por sensación (reparto de Paco), material y altura */
LM.FILTROS_B = {
  sens: { firme: ['visco', 'gran'], equilibrada: ['visco', 'gold', 'latex'], acogedora: ['gran', 'latex'] },
  mat:  [['all', 'Todos'], ['latex', 'Látex'], ['muelles', 'Muelles ensacados'], ['visco', 'Visco']],
  matDe: { latex: ['latex', 'gran'], muelles: ['gold', 'latex'], visco: ['visco', 'gold'] }
};

/* Ficha de pack (29/10). Paco: comprando colchón + canapé (o base) juntos, se regalan almohadas, edredón y protector.
   Colores: canapé = los 4 de la tienda. Base: Paco pide 4 colores; son los de la «Base tapizada de tela»
   (la base del pack en la tienda, la antideslizante, solo tiene Blanco y Chocolate): pendiente de confirmar. */
LM.REGALOS = [['Almohadas', 'Para cada lado de la cama', 'almohada'], ['Edredón nórdico', 'Listo para la primera noche', 'edredon'], ['Protector de colchón', 'Cuida tu colchón desde el primer día', 'protector']];
LM.PACK_BASES = {
  canape: { t: 'Canapé abatible', corto: 'canapé', d: 'De madera, con mucho espacio para guardar', img: '../img/pack-conf-canape', tabla: 'Canape',
            colores: [['Blanco', '#f1eee8'], ['Nórdico', '#dcc6a2'], ['Roble', '#b5875a'], ['Nogal', '#5b3d2c']], porDefecto: 'Nogal', foto: 'Nogal' },
  base:   { t: 'Base tapizada', corto: 'base tapizada', d: 'Antideslizante, con patas de 30 cm', img: '../img/pack-conf-patas', tabla: 'Base',
            colores: [['Antracita', '#3b3c40'], ['Beige', '#d8cbb3'], ['Chocolate', '#4a3427'], ['Gris claro', '#c8c8cc']], porDefecto: 'Antracita', foto: 'Antracita',
            pend: 'la base del pack en la tienda solo tiene Blanco y Chocolate; los 4 colores son de la base tapizada de tela' }
};
