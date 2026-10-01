/**
 * 构建脚本：把 data/places/ 下每个地点一个的 JSON 文件，
 * 校验 + 合并 + 自动补上 public/images/<id>/ 里的照片，
 * 生成 data/places.json（页面代码读取的最终文件）。
 *
 * 会在每次 `npm run build`（也就是 Vercel 部署）时自动跑一次，
 * 不需要手动执行。本地想手动跑的话： node scripts/build-places.js
 */
const fs = require("fs");
const path = require("path");
const {
  TAGS,
  CUISINE,
  ATMOSPHERE,
  SEATING_OPTIONS,
  SUITABLE_FOR,
  FACILITIES,
  SUB_CATEGORY,
  WEATHER_ADAPT,
  VEGETARIAN_LEVEL,
  RECOMMEND_BIN,
} = require("../lib/vocab");

const ROOT = path.join(__dirname, "..");
const PLACES_DIR = path.join(ROOT, "data", "places");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const OUTPUT_PATH = path.join(ROOT, "data", "places.json");

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const VALID_TYPES = ["restaurant", "attraction"];
const REQUIRED_STRING_FIELDS = ["id", "type", "name", "nameCn", "area", "description"];

// 词汇型字段：值必须是词典里已经登记的key，登记新词见 lib/vocab.js
const VOCAB_ARRAY_FIELDS_COMMON = [{ field: "tags", dict: TAGS, dictName: "TAGS" }];
const VOCAB_ARRAY_FIELDS_RESTAURANT = [
  { field: "cuisine", dict: CUISINE, dictName: "CUISINE" },
  { field: "atmosphere", dict: ATMOSPHERE, dictName: "ATMOSPHERE" },
  { field: "seatingOptions", dict: SEATING_OPTIONS, dictName: "SEATING_OPTIONS" },
];
const VOCAB_ARRAY_FIELDS_ATTRACTION = [
  { field: "suitableFor", dict: SUITABLE_FOR, dictName: "SUITABLE_FOR" },
  { field: "facilities", dict: FACILITIES, dictName: "FACILITIES" },
];

// 自由文字字段：不强制要求英文版，缺了只警告，不会让构建失败
const FREE_TEXT_EN_FIELDS_TOP = ["description", "openingHours", "suggestedDuration", "recommendNote"];
const FREE_TEXT_EN_FIELDS_RESTAURANT = ["signatureDishes", "reservationDifficulty", "reservationPlatform", "dressCode"];
const FREE_TEXT_EN_FIELDS_ATTRACTION = ["bestTimeVisit", "ticketPriceDesc", "highlights"];

function findPhotos(id) {
  const folder = path.join(IMAGES_DIR, id);
  if (!fs.existsSync(folder)) return [];
  return fs
    .readdirSync(folder)
    .filter((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => `/images/${id}/${f}`);
}

function checkVocabArray(obj, field, dict, dictName, errors) {
  const val = obj[field];
  if (val === undefined) return;
  if (!Array.isArray(val)) {
    errors.push(`"${field}"字段必须是数组`);
    return;
  }
  for (const key of val) {
    if (!dict[key]) {
      errors.push(`"${field}"里的"${key}"不是${dictName}词典里登记过的key，去lib/vocab.js里加一条，或者改成已有的key`);
    }
  }
}

function validate(place, filename) {
  const errors = [];
  const expectedId = filename.replace(/\.json$/, "");

  for (const field of REQUIRED_STRING_FIELDS) {
    if (!place[field] || typeof place[field] !== "string" || place[field].trim() === "") {
      errors.push(`缺少必填字段 "${field}"`);
    }
  }

  if (place.id && place.id !== expectedId) {
    errors.push(`id字段("${place.id}")跟文件名("${expectedId}.json")不一致，两者必须相同`);
  }

  if (place.type && !VALID_TYPES.includes(place.type)) {
    errors.push(`type字段的值是"${place.type}"，只能填 "restaurant" 或 "attraction"`);
  }

  if (
    !Array.isArray(place.coordinates) ||
    place.coordinates.length !== 2 ||
    typeof place.coordinates[0] !== "number" ||
    typeof place.coordinates[1] !== "number"
  ) {
    errors.push('coordinates字段必须是形如 [纬度, 经度] 的两个数字，例如 [1.2816, 103.8636]');
  }

  for (const { field, dict, dictName } of VOCAB_ARRAY_FIELDS_COMMON) {
    checkVocabArray(place, field, dict, dictName, errors);
  }

  if (place.type === "restaurant") {
    if (!place.restaurantFeatures || typeof place.restaurantFeatures !== "object") {
      errors.push('type是restaurant，但缺少restaurantFeatures对象');
    } else {
      for (const { field, dict, dictName } of VOCAB_ARRAY_FIELDS_RESTAURANT) {
        checkVocabArray(place.restaurantFeatures, field, dict, dictName, errors);
      }
      if (
        place.restaurantFeatures.vegetarianLevel &&
        !VEGETARIAN_LEVEL[place.restaurantFeatures.vegetarianLevel]
      ) {
        errors.push(
          `"vegetarianLevel"的值"${place.restaurantFeatures.vegetarianLevel}"不是VEGETARIAN_LEVEL词典里登记过的key（此字段只能由人工研究后填写，Gemini不应填写此字段）`
        );
      }
      if (
        place.restaurantFeatures.recommendBin &&
        !RECOMMEND_BIN[place.restaurantFeatures.recommendBin]
      ) {
        errors.push(
          `"recommendBin"的值"${place.restaurantFeatures.recommendBin}"不是RECOMMEND_BIN词典里登记过的key（只能是 bin1/bin2/bin3，此字段由人工评估后填写，Gemini不应填写此字段）`
        );
      }
    }
  }

  if (place.type === "attraction") {
    if (!place.attractionFeatures || typeof place.attractionFeatures !== "object") {
      errors.push('type是attraction，但缺少attractionFeatures对象');
    } else {
      for (const { field, dict, dictName } of VOCAB_ARRAY_FIELDS_ATTRACTION) {
        checkVocabArray(place.attractionFeatures, field, dict, dictName, errors);
      }
      if (place.attractionFeatures.subCategory && !SUB_CATEGORY[place.attractionFeatures.subCategory]) {
        errors.push(
          `"subCategory"的值"${place.attractionFeatures.subCategory}"不是SUB_CATEGORY词典里登记过的key`
        );
      }
      if (place.attractionFeatures.weatherAdaptability && !WEATHER_ADAPT[place.attractionFeatures.weatherAdaptability]) {
        errors.push(
          `"weatherAdaptability"的值"${place.attractionFeatures.weatherAdaptability}"只能是 indoor/outdoor/mixed 之一`
        );
      }
    }
  }

  return errors;
}

// 纯英文/数字/符号的值（比如 dressCode: "Casual"）本来就不需要翻译，
// 只有含中文字符的值才需要检查是否配了英文版
function containsChinese(val) {
  if (Array.isArray(val)) return val.some((v) => containsChinese(v));
  return typeof val === "string" && /[一-鿿]/.test(val);
}

// 检查自由文字字段有没有配英文版，缺了只记录警告（不影响构建成功）
function collectMissingTranslations(place) {
  const missing = [];

  for (const field of FREE_TEXT_EN_FIELDS_TOP) {
    const val = place[field];
    if (containsChinese(val) && !place[`${field}En`]) missing.push(field);
  }

  const features =
    place.type === "restaurant" ? place.restaurantFeatures : place.type === "attraction" ? place.attractionFeatures : null;
  const fieldList = place.type === "restaurant" ? FREE_TEXT_EN_FIELDS_RESTAURANT : FREE_TEXT_EN_FIELDS_ATTRACTION;

  if (features) {
    for (const field of fieldList) {
      const val = features[field];
      if (containsChinese(val) && !features[`${field}En`]) missing.push(field);
    }
  }

  return missing;
}

function buildPlaces() {
  if (!fs.existsSync(PLACES_DIR)) {
    console.error(`找不到目录 ${PLACES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(PLACES_DIR).filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    console.warn("data/places/ 里还没有任何地点文件，生成一个空的 places.json");
    fs.writeFileSync(OUTPUT_PATH, "[]\n", "utf-8");
    return;
  }

  const places = [];
  const allErrors = [];
  const translationWarnings = [];
  const missingBinWarnings = [];

  for (const filename of files) {
    const fullPath = path.join(PLACES_DIR, filename);
    const raw = fs.readFileSync(fullPath, "utf-8");

    let place;
    try {
      place = JSON.parse(raw);
    } catch (e) {
      allErrors.push(`【${filename}】JSON格式错误，无法解析：${e.message}`);
      continue;
    }

    const errors = validate(place, filename);
    if (errors.length > 0) {
      for (const err of errors) {
        allErrors.push(`【${filename}】${err}`);
      }
      continue;
    }

    // 照片：如果文件里自己写了非空的 photos 数组就尊重它，
    // 否则自动从 public/images/<id>/ 文件夹里扫描填充。
    if (!Array.isArray(place.photos) || place.photos.length === 0) {
      place.photos = findPhotos(place.id);
    }

    const missing = collectMissingTranslations(place);
    if (missing.length > 0) {
      translationWarnings.push(`${place.name}（缺：${missing.join("、")}）`);
    }

    if (place.type === "restaurant" && !place.restaurantFeatures.recommendBin) {
      missingBinWarnings.push(place.name);
    }

    places.push(place);
  }

  if (allErrors.length > 0) {
    console.error("\n========== 数据文件校验失败，构建已中止 ==========");
    for (const err of allErrors) {
      console.error("  ✗ " + err);
    }
    console.error("====================================================\n");
    console.error("请修好上面列出的文件后再重新推送。");
    process.exit(1);
  }

  places.sort((a, b) => a.id.localeCompare(b.id));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(places, null, 2) + "\n", "utf-8");

  const noPhotos = places.filter((p) => p.photos.length === 0).map((p) => p.name);
  console.log(`✓ 已合并 ${places.length} 个地点 → ${path.relative(ROOT, OUTPUT_PATH)}`);
  if (noPhotos.length > 0) {
    console.log(`  （还没有照片的地点：${noPhotos.join("、")}）`);
  }
  if (translationWarnings.length > 0) {
    console.log(`  （还没有完整英文翻译的地点，英文页面会暂时退回显示中文：）`);
    for (const w of translationWarnings) {
      console.log(`    - ${w}`);
    }
  }
  if (missingBinWarnings.length > 0) {
    console.log(`  （还没有评估推荐Bin的餐厅：${missingBinWarnings.join("、")}）`);
  }
}

module.exports = { buildPlaces };

if (require.main === module) {
  buildPlaces();
}
