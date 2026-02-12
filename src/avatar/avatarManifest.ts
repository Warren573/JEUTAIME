export const AVATAR_MANIFEST_URL = '/avatar_v1/manifest.json';

export const LAYER_FOLDER_BY_CATEGORY = {
  head: '01_head',
  eyes: '02_eyes',
  nose: '03_nose',
  mouth: '04_mouth',
  hair: '05_hair',
  beard: '06_beard',
  accessories: '07_accessories'
};

export async function loadAvatarManifest() {
  const res = await fetch(AVATAR_MANIFEST_URL);
  if (!res.ok) {
    throw new Error(`Impossible de charger le manifest avatar (${res.status})`);
  }
  return res.json();
}

export function getLayerPath(category, id) {
  if (!id) return null;
  const folder = LAYER_FOLDER_BY_CATEGORY[category];
  if (!folder) return null;
  return `/avatar_v1/layers/${folder}/${id}.svg`;
}
