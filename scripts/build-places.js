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

const ROOT = path.join(__dirname, "..");
const PLACES_DIR = path.join(ROOT, "data", "places");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const OUTPUT_PATH = path.join(ROOT, "data", "places.json");

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const VALID_TYPES = ["restaurant", "attraction"];
const REQUIRED_STRING_FIELDS = ["id", "type", "name", "nameCn", "area", "description"];

function findPhotos(id) {
  const folder = path.join(IMAGES_DIR, id);
  if (!fs.existsSync(folder)) return [];
  return fs
    .readdirSync(folder)
    .filter((f) => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => `/images/${id}/${f}`);
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

  if (place.type === "restaurant" && (!place.restaurantFeatures || typeof place.restaurantFeatures !== "object")) {
    errors.push('type是restaurant，但缺少restaurantFeatures对象');
  }
  if (place.type === "attraction" && (!place.attractionFeatures || typeof place.attractionFeatures !== "object")) {
    errors.push('type是attraction，但缺少attractionFeatures对象');
  }

  return errors;
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
}

module.exports = { buildPlaces };

if (require.main === module) {
  buildPlaces();
}
