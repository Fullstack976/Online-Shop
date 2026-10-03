import type { Category, Product } from "../types.ts";
import { unsplash } from "../utils.ts";

// All Unsplash ids here were checked to resolve.
export { unsplash };

const catId = (n: number) => `11111111-0000-4000-8000-${String(n).padStart(12, "0")}`;
const prodId = (n: number) => `22222222-0000-4000-8000-${String(n).padStart(12, "0")}`;

export const categories: Category[] = [
  { id: catId(1), name: "Аксессуар", slug: "accessories", imageUrl: unsplash("1511499767150-a48a237f0083", 600), sortOrder: 1 },
  { id: catId(2), name: "Электроник", slug: "electronics", imageUrl: unsplash("1583394838336-acd977736f90", 600), sortOrder: 2 },
  { id: catId(3), name: "Гэр ахуй", slug: "home-living", imageUrl: unsplash("1485955900006-10f4d324d411", 600), sortOrder: 3 },
  { id: catId(4), name: "Хувцас загвар", slug: "fashion", imageUrl: unsplash("1490481651871-ab68de25d43d", 600), sortOrder: 4 },
  { id: catId(5), name: "Гоо сайхан", slug: "beauty", imageUrl: unsplash("1611930022073-b7a4ba5fcccd", 600), sortOrder: 5 },
  { id: catId(6), name: "Спорт", slug: "sports", imageUrl: unsplash("1638536532686-d610adfc8e5c", 600), sortOrder: 6 },
  { id: catId(7), name: "Тоглоом", slug: "toys-games", imageUrl: unsplash("1530325553241-4f6e7690cf36", 600), sortOrder: 7 },
];

type Seed = {
  /** Kept separate from the (Mongolian) name so product URLs stay stable. */
  slug: string;
  name: string;
  cat: number;
  price: number;
  compareAt?: number;
  photos: string[];
  stock: number;
  rating: number;
  reviews: number;
  trending?: boolean;
  blurb: string;
};

// Order matters: the first five trending items mirror the homepage design.
const seeds: Seed[] = [
  { slug: "smart-watch-series-9", name: "Ухаалаг цаг Series 9", cat: 2, price: 159.99, compareAt: 199.99, photos: ["1579586337278-3befd40fd17a", "1546868871-7041f2a55e12", "1508685096489-7aacd43bd3b1"], stock: 42, rating: 4.5, reviews: 128, trending: true, blurb: "Үргэлж асаалттай Retina дэлгэц, зүрхний цохилт болон нойрны хяналттай. Хөнгөн цагаан их биетэй, батарей нь 18 цаг хүртэл ажиллана." },
  { slug: "travel-backpack", name: "Аяллын үүргэвч", cat: 4, price: 49.99, compareAt: 58.99, photos: ["1491637639811-60e2756cc1c7", "1547949003-9792a18a2601"], stock: 65, rating: 4.4, reviews: 96, trending: true, blurb: "Ус нэвтрүүлдэггүй даавуу, 15 инчийн зөөврийн компьютерийн жийргэвчтэй тасалгаа, арьсан оосортой. Амралтын аялал болон өдөр тутмын хэрэглээнд тохиромжтой." },
  { slug: "wireless-earbuds", name: "Утасгүй чихэвч", cat: 2, price: 29.99, photos: ["1572569511254-d8f925fe2cbb", "1600294037681-c80b4cb5b434"], stock: 120, rating: 4.6, reviews: 243, trending: true, blurb: "Тунгалаг дуугаралт, идэвхтэй дуу чимээ бууруулагчтай. Халаасны цэнэглэгч хайрцагтайгаа нийт 24 цаг ажиллана." },
  { slug: "perfume-for-men", name: "Эрэгтэй үнэртэй ус", cat: 5, price: 69.99, compareAt: 89.99, photos: ["1622618991746-fe6004db3a47", "1587017539504-67cfbddac569"], stock: 30, rating: 4.3, reviews: 75, trending: true, blurb: "Бергамот, хуш мод, хувын үнэр бүхий модлог үнэртэй ус. Удаан тогтдог, 100 мл." },
  { slug: "moon-glow-lamp", name: "Moon Glow чийдэн", cat: 3, price: 24.99, photos: ["1517991104123-1d56a6e81ed9", "1565814329452-e1efa11c5b89"], stock: 8, rating: 4.4, reviews: 58, trending: true, blurb: "Гэрлийг нь тохируулж болдог дулаан туяа, маалинган бүрхүүл, гурван хөлтэй модон суурьтай. Орны хажуугийн ширээнд яг тохирно." },

  { slug: "classic-aviator-sunglasses", name: "Сонгодог авиатор нарны шил", cat: 1, price: 39.99, compareAt: 49.99, photos: ["1572635196237-14b3f281503f", "1577803645773-f96470509666"], stock: 54, rating: 4.5, reviews: 88, trending: true, blurb: "UV400 хамгаалалттай поляризацтай шил, хөнгөн металл хүрээтэй. Хатуу гэр, арчих алчууртай." },
  { slug: "round-retro-sunglasses", name: "Ретро дугуй нарны шил", cat: 1, price: 34.99, photos: ["1511499767150-a48a237f0083"], stock: 40, rating: 4.2, reviews: 41, blurb: "Винтеж загварын дугуй хүрээ, градиент шилтэй. Хэт ягаан туяанаас бүрэн хамгаална." },
  { slug: "leather-bifold-wallet", name: "Арьсан түрийвч", cat: 1, price: 29.99, photos: ["1627123424574-724758594e93"], stock: 75, rating: 4.7, reviews: 132, blurb: "Жинхэнэ арьсан, RFID хамгаалалттай, зургаан картын тасалгаатай нимгэн түрийвч." },
  { slug: "genuine-leather-belt", name: "Жинхэнэ арьсан бүс", cat: 1, price: 24.99, photos: ["1624222247344-550fb60583dc"], stock: 60, rating: 4.3, reviews: 37, blurb: "Гараар боловсруулсан үхрийн арьсан бүс, өнгөлсөн металл горхитой. Олон хэмжээтэй." },
  { slug: "everyday-baseball-cap", name: "Өдөр тутмын бейсболк малгай", cat: 1, price: 19.99, photos: ["1588850561407-ed78c282e89b"], stock: 90, rating: 4.1, reviews: 29, blurb: "Агаар нэвтрүүлдэг хөвөн даавуун малгай, тохируулгатай оосор, муруй саравчтай." },
  { slug: "minimal-analog-watch", name: "Минимал гар цаг", cat: 1, price: 89.99, compareAt: 109.99, photos: ["1523275335684-37898b6baf30", "1524592094714-0f0654e20314"], stock: 22, rating: 4.6, reviews: 64, blurb: "Цэвэрхэн нүүр, сапфир бүрээстэй шил, сольж болох силикон оосортой. 50 м хүртэл ус нэвтрүүлэхгүй." },
  { slug: "rose-gold-chronograph", name: "Ягаан алтлаг хронограф цаг", cat: 1, price: 129.99, photos: ["1522312346375-d1a52e2b99b3"], stock: 14, rating: 4.8, reviews: 51, blurb: "Ягаан алтан өнгөлгөөтэй зэвэрдэггүй ган хронограф, торон бугуйвчтай." },

  { slug: "studio-over-ear-headphones", name: "Студи чихэвч", cat: 2, price: 79.99, compareAt: 99.99, photos: ["1505740420928-5e560c06d30e", "1583394838336-acd977736f90"], stock: 35, rating: 4.6, reviews: 187, trending: true, blurb: "Гүн басс, зөөлөн жийргэвчтэй, утасгүйгээр 40 цаг сонсох боломжтой." },
  { slug: "portable-bluetooth-speaker", name: "Зөөврийн Bluetooth чанга яригч", cat: 2, price: 49.99, photos: ["1608043152269-423dbba4e7e1"], stock: 48, rating: 4.4, reviews: 102, blurb: "360° дуугаралт, IPX7 усны хамгаалалттай, бат бөх даавуун их биетэй. 12 цаг тасралтгүй ажиллана." },
  { slug: "instant-film-camera", name: "Шууд хэвлэдэг камер", cat: 2, price: 69.99, photos: ["1526170375885-4d8ecf77b99f"], stock: 18, rating: 4.5, reviews: 73, blurb: "Чиглүүл, дар, хэвлэ. Автомат гэрэлтүүлэг, суурилуулсан флэш, селфи толинцортой." },
  { slug: "slim-wireless-keyboard", name: "Нимгэн утасгүй keyboard", cat: 2, price: 45.99, photos: ["1587829741301-dc798b83add3"], stock: 52, rating: 4.3, reviews: 58, blurb: "Намхан товчлууртай, хэд хэдэн төхөөрөмжтэй зэрэг холбогдох боломжтой, цэнэглэдэг батарейтай." },
  { slug: "ergonomic-wireless-mouse", name: "Эргономик утасгүй хулгана", cat: 2, price: 19.99, photos: ["1527864550417-7fd91fc51a46"], stock: 110, rating: 4.2, reviews: 91, blurb: "Чимээгүй даралт, тохируулгатай DPI, өдөржин ашиглахад тав тухтай хэлбэртэй." },
  { slug: "pro-tablet-11", name: "Pro таблет 11\"", cat: 2, price: 399.99, compareAt: 449.99, photos: ["1544244015-0df4b3ffc6b0"], stock: 12, rating: 4.7, reviews: 46, blurb: "11 инчийн Liquid дэлгэц, өдөржин ажиллах батарейтай. Үзэг болон keyboard дэмжинэ." },
  { slug: "wireless-game-controller", name: "Утасгүй тоглоомын жойстик", cat: 2, price: 54.99, photos: ["1592840496694-26d035b52b48"], stock: 33, rating: 4.6, reviews: 120, blurb: "Мэдрэмтгий гох товч, чичиргээт хариу үйлдэл, цэнэглэдэг батарейтай." },
  { slug: "usb-c-fast-charger", name: "USB-C хурдан цэнэглэгч", cat: 2, price: 24.99, photos: ["1583863788434-e58a36330cf0"], stock: 6, rating: 4.4, reviews: 67, blurb: "65 Вт GaN цэнэглэгч, 2 м сүлжмэл кабельтай. Зөөврийн компьютер, таблет, утас цэнэглэнэ." },

  { slug: "succulent-in-ceramic-pot", name: "Шаазан вааранд суккулент", cat: 3, price: 18.99, photos: ["1485955900006-10f4d324d411"], stock: 45, rating: 4.7, reviews: 80, blurb: "Гаа ногоон өнгийн шаазан вааранд суулгасан, арчилгаа бага шаарддаг суккулент. Ширээг тань амьд болгоно." },
  { slug: "minimal-ceramic-mug", name: "Минимал шаазан аяга", cat: 3, price: 12.99, photos: ["1514228742587-6b1558fcca3d"], stock: 140, rating: 4.5, reviews: 54, blurb: "Сатин паалантай шаазан аяга. Аяга угаагч, богино долгионы зууханд хэрэглэж болно, 350 мл." },
  { slug: "pendant-ceiling-light", name: "Унжлагат таазны гэрэл", cat: 3, price: 59.99, photos: ["1543198126-a8ad8e47fb22", "1540932239986-30128078f3c5"], stock: 20, rating: 4.4, reviews: 23, blurb: "Скандинав загварын бөмбөгөр гэрэл, будсан ган их бие, уртыг нь тохируулдаг утастай." },
  { slug: "adjustable-desk-lamp", name: "Тохируулгат ширээний чийдэн", cat: 3, price: 39.99, photos: ["1507473885765-e6ed057f782c"], stock: 28, rating: 4.3, reviews: 36, blurb: "Нугалдаг гар, хүнд суурь, ажилд төвлөрөхөд зориулсан дулаан LED гэрэлтэй." },
  { slug: "tufted-accent-chair", name: "Товчин хээтэй сандал", cat: 3, price: 189.99, compareAt: 229.99, photos: ["1567538096630-e0c55bd6374c"], stock: 7, rating: 4.6, reviews: 19, blurb: "Товчоор чимсэн зөөлөн бүрээс, хатуу модон хөлтэй. Өрөөний аль ч буланг онцолно." },
  { slug: "soft-cotton-pillow", name: "Зөөлөн хөвөн дэр", cat: 3, price: 22.99, photos: ["1584100936595-c0654b55a2e2"], stock: 70, rating: 4.4, reviews: 47, blurb: "Харшил үүсгэдэггүй дүүргэгчтэй, агаар нэвтрүүлдэг 300 утасны нягттай хөвөн бүрээстэй." },
  { slug: "mini-cactus-pot", name: "Жижиг кактус", cat: 3, price: 9.99, photos: ["1459411552884-841db9b3cc2a"], stock: 95, rating: 4.8, reviews: 61, blurb: "Терракота вааранд суулгасан жижигхэн кактус. Арчлахад хамгийн амар ургамал." },

  { slug: "essential-white-t-shirt", name: "Энгийн цагаан футболк", cat: 4, price: 19.99, photos: ["1521572163474-6864f9cf17ab"], stock: 200, rating: 4.5, reviews: 210, blurb: "Органик хөвөн даавуун зузаан футболк, сул загвартай, бэхжүүлсэн захтай." },
  { slug: "leather-biker-jacket", name: "Арьсан байкер куртик", cat: 4, price: 149.99, compareAt: 189.99, photos: ["1551028719-00167b16eac5"], stock: 15, rating: 4.7, reviews: 44, trending: true, blurb: "Зөөлөн хурганы арьсан, ташуу цахилгаантай, мөрөндөө оёмол хээтэй." },
  { slug: "classic-grey-hoodie", name: "Сонгодог саарал hoodie", cat: 4, price: 44.99, photos: ["1556821840-3a63f95609a7"], stock: 80, rating: 4.6, reviews: 98, blurb: "Дотор талдаа зөөлөн флистэй, урд халаастай, доторлогоотой малгайтай." },
  { slug: "slim-fit-denim-jeans", name: "Нарийн жинсэн өмд", cat: 4, price: 59.99, photos: ["1542272604-787c3835535d"], stock: 64, rating: 4.3, reviews: 77, blurb: "Сунадаг жинсэн даавуу, орчин үеийн нарийн загвар, дунд бүсэлхийтэй." },
  { slug: "urban-runner-sneakers", name: "Urban Runner пүүз", cat: 4, price: 79.99, compareAt: 94.99, photos: ["1560769629-975ec94e6a86"], stock: 38, rating: 4.5, reviews: 112, blurb: "Хөнгөн сүлжмэл дээд хэсэг, хотоор алхахад зориулсан зөөлөн ултай." },
  { slug: "leather-messenger-backpack", name: "Арьсан мессенжер үүргэвч", cat: 4, price: 89.99, photos: ["1622560480605-d83c853bc5c3", "1585916420730-d7f95e942d43"], stock: 21, rating: 4.6, reviews: 39, blurb: "Лаа шингээсэн даавуу ба арьсаар хийсэн, горхин бэхэлгээтэй, жийргэвчтэй компьютерийн халаастай." },

  { slug: "floral-eau-de-parfum", name: "Цэцгийн үнэртэй ус", cat: 5, price: 74.99, photos: ["1595425970377-c9703cf48b6d"], stock: 26, rating: 4.6, reviews: 82, blurb: "Сарнай, цээнэ цэцэг, цагаан заарын зөөлөн цэцгэн үнэр. 50 мл." },
  { slug: "hydrating-skincare-set", name: "Чийгшүүлэх арьс арчилгааны багц", cat: 5, price: 34.99, photos: ["1611930022073-b7a4ba5fcccd"], stock: 44, rating: 4.5, reviews: 66, blurb: "Гиалуроны хүчилтэй цэвэрлэгч, тоник, тос — өдөр бүрийн чийгшүүлэлтэд." },
  { slug: "botanical-serum-collection", name: "Ургамлын серумын багц", cat: 5, price: 42.99, photos: ["1612817288484-6f916006741a"], stock: 31, rating: 4.4, reviews: 38, blurb: "Гэрэлтүүлэх, чангалах, тайвшруулах үйлчилгээтэй ургамлын гаралтай гурван серум." },
  { slug: "pro-makeup-brush-set", name: "Мэргэжлийн будгийн бийрний багц", cat: 5, price: 27.99, photos: ["1596462502278-27bfdc403348"], stock: 58, rating: 4.7, reviews: 105, blurb: "Хэт зөөлөн нийлэг үстэй, амьтны гаралгүй 12 бийр, аяллын уутны хамт." },
  { slug: "gentle-face-cream", name: "Зөөлөн нүүрний тос", cat: 5, price: 16.99, photos: ["1620916566398-39f1143ab7be"], stock: 4, rating: 4.3, reviews: 27, blurb: "Мэдрэг арьсанд зориулсан үнэргүй, өдөр тутмын чийгшүүлэгч тос. 75 мл." },

  { slug: "hex-dumbbell-set", name: "Зургаан талт гантелийн багц", cat: 6, price: 64.99, photos: ["1638536532686-d610adfc8e5c"], stock: 19, rating: 4.7, reviews: 71, blurb: "Резинэн бүрээстэй зургаан талт гантель, гулгадаггүй хром бариултай. 2 × 10 кг." },
  { slug: "resistance-training-kit", name: "Резинэн дасгалын багц", cat: 6, price: 29.99, photos: ["1584735935682-2f2b69dff9d2"], stock: 50, rating: 4.4, reviews: 49, blurb: "Таван резинэн тууз, хаалганы бэхэлгээ, бариул, шагайны оосортой." },
  { slug: "premium-yoga-mat", name: "Премиум йогийн дэвсгэр", cat: 6, price: 32.99, photos: ["1601925260368-ae2f83cf8b7f"], stock: 62, rating: 4.6, reviews: 93, blurb: "6 мм зузаан, гулгадаггүй, байрлалын зураастай, зөөх оосортой дэвсгэр." },
  { slug: "indoor-outdoor-basketball", name: "Сагсан бөмбөг", cat: 6, price: 29.99, photos: ["1519861531473-9200262188bf"], stock: 40, rating: 4.5, reviews: 58, blurb: "Гадаа, дотор тоглоход тохиромжтой. Нийлмэл арьсан бүрээс, сайн атгалт өгөх гүн ховилтой. 7-р хэмжээ." },
  { slug: "match-football", name: "Хөл бөмбөг", cat: 6, price: 24.99, photos: ["1614632537190-23e4146777db"], stock: 46, rating: 4.4, reviews: 34, blurb: "Дулаанаар наасан хэсгүүд нь нислэгийг жигд, мэдрэмжийг тогтвортой болгоно. 5-р хэмжээ." },
  { slug: "insulated-water-bottle", name: "Термос усны сав", cat: 6, price: 21.99, photos: ["1602143407151-7111542de6e8"], stock: 130, rating: 4.7, reviews: 156, blurb: "Давхар ханатай зэвэрдэггүй ган сав ундааг 24 цаг хүйтэн, 12 цаг халуун байлгана. 750 мл." },
  { slug: "performance-running-shoes", name: "Гүйлтийн пүүз", cat: 6, price: 89.99, compareAt: 119.99, photos: ["1491553895911-0055eca6402d"], stock: 27, rating: 4.6, reviews: 84, blurb: "Уян зөөлөн ул, агаар нэвтрүүлдэг торон дээд хэсэгтэй — урт зайн гүйлтэд зориулав." },

  { slug: "classic-teddy-bear", name: "Тедди баавгай", cat: 7, price: 19.99, photos: ["1530325553241-4f6e7690cf36", "1559454403-b8fb88521f11"], stock: 55, rating: 4.9, reviews: 142, blurb: "Хатгамал нүүртэй, хэт зөөлөн тоглоом баавгай. Бүх насныханд аюулгүй." },
  { slug: "building-blocks-set", name: "Барилгын шоо тоглоом", cat: 7, price: 34.99, photos: ["1587654780291-39c9404d746b"], stock: 36, rating: 4.7, reviews: 88, blurb: "Хүссэн бүхнээ бүтээх 1,000 өнгө өнгийн холбогддог шоо." },
  { slug: "vintage-toy-car", name: "Ретро тоглоом машин", cat: 7, price: 15.99, photos: ["1594787318286-3d835c1d207f"], stock: 64, rating: 4.5, reviews: 41, blurb: "Ар тийш нь татаад тавихад явдаг, хаалга нь онгойдог металл кабриолет." },
  { slug: "strategy-board-game", name: "Стратегийн ширээний тоглоом", cat: 7, price: 29.99, photos: ["1606503153255-59d8b8b82176"], stock: 23, rating: 4.6, reviews: 57, blurb: "2–6 тоглогчтой, 10+ насныханд зориулсан газар нутаг эзлэх тактикийн тоглоом." },
  { slug: "wooden-train-set", name: "Модон галт тэрэгний багц", cat: 7, price: 39.99, photos: ["1596461404969-9ae70f2830c1"], stock: 17, rating: 4.8, reviews: 33, blurb: "Гүүр, дохио, хотын буудал бүхий 52 хэсэгтэй модон төмөр зам." },
];

const DAY = 24 * 60 * 60 * 1000;

/**
 * Products with a "days ago" offset so seed SQL can express created_at relative to now().
 * Earlier seeds are newer, so the "featured" sort (trending first, then newest) keeps seed order.
 */
export const productSeeds = seeds.map((s, i) => ({
  ...s,
  id: prodId(i + 1),
  daysAgo: i * 2,
}));

export function buildProducts(now = Date.now()): Product[] {
  return productSeeds.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.blurb,
    price: s.price,
    compareAtPrice: s.compareAt ?? null,
    categoryId: catId(s.cat),
    images: s.photos.map((p) => unsplash(p)),
    stock: s.stock,
    rating: s.rating,
    reviewCount: s.reviews,
    isTrending: Boolean(s.trending),
    isActive: true,
    createdAt: new Date(now - s.daysAgo * DAY).toISOString(),
  }));
}
