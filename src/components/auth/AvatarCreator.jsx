import React, { useState } from "react";
import Avatar from "avataaars";

const AvatarCreator = ({ onSave }) => {
  const [gender, setGender] = useState("femme"); // homme, femme, neutre
  const [avatarConfig, setAvatarConfig] = useState({
    avatarStyle: "Circle",
    topType: "LongHairStraight",
    accessoriesType: "Blank",
    hairColor: "BrownDark",
    facialHairType: "Blank",
    clotheType: "BlazerShirt",
    eyeType: "Happy",
    eyebrowType: "Default",
    mouthType: "Smile",
    skinColor: "Light",
  });

  const handleChange = (field, value) => {
    setAvatarConfig({ ...avatarConfig, [field]: value });
  };

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    // Adjust default hair style based on gender
    if (newGender === "homme") {
      setAvatarConfig({ ...avatarConfig, topType: "ShortHairShortFlat", facialHairType: "Blank" });
    } else if (newGender === "femme") {
      setAvatarConfig({ ...avatarConfig, topType: "LongHairStraight", facialHairType: "Blank" });
    }
  };

  const handleSave = () => {
    // Convert SVG to data URL
    const svgElement = document.getElementById("avatar-svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Save avatar config for later editing
      localStorage.setItem("userAvatarConfig", JSON.stringify(avatarConfig));

      if (onSave) onSave(svgUrl, avatarConfig);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Crée ton avatar 💖</h3>

      {/* Gender selector */}
      <div style={styles.genderSelector}>
        <button
          onClick={() => handleGenderChange("femme")}
          style={{
            ...styles.genderButton,
            ...(gender === "femme" ? styles.genderButtonActive : {}),
          }}
        >
          👩 Femme
        </button>
        <button
          onClick={() => handleGenderChange("homme")}
          style={{
            ...styles.genderButton,
            ...(gender === "homme" ? styles.genderButtonActive : {}),
          }}
        >
          👨 Homme
        </button>
        <button
          onClick={() => handleGenderChange("neutre")}
          style={{
            ...styles.genderButton,
            ...(gender === "neutre" ? styles.genderButtonActive : {}),
          }}
        >
          🧑 Autre
        </button>
      </div>

      <div style={styles.avatarWrapper}>
        <div id="avatar-svg">
          <Avatar
            style={{ width: "200px", height: "200px" }}
            {...avatarConfig}
          />
        </div>
      </div>

      <div style={styles.controls}>
        <label style={styles.label}>
          <span style={styles.labelText}>Cheveux</span>
          <select
            onChange={(e) => handleChange("topType", e.target.value)}
            value={avatarConfig.topType}
            style={styles.select}
          >
            <optgroup label="Cheveux longs">
              <option value="LongHairBigHair">Volumineux</option>
              <option value="LongHairBob">Carré long</option>
              <option value="LongHairBun">Chignon</option>
              <option value="LongHairCurly">Bouclés longs</option>
              <option value="LongHairCurvy">Ondulés longs</option>
              <option value="LongHairDreads">Dreadlocks longues</option>
              <option value="LongHairFrida">Style Frida</option>
              <option value="LongHairFro">Afro long</option>
              <option value="LongHairFroBand">Afro avec bandeau</option>
              <option value="LongHairMiaWallace">Style Mia Wallace</option>
              <option value="LongHairNotTooLong">Mi-longs</option>
              <option value="LongHairShavedSides">Rasés sur les côtés</option>
              <option value="LongHairStraight">Raides longs</option>
              <option value="LongHairStraight2">Raides longs 2</option>
              <option value="LongHairStraightStrand">Mèche longue</option>
            </optgroup>
            <optgroup label="Cheveux courts">
              <option value="ShortHairDreads01">Dreads courtes</option>
              <option value="ShortHairDreads02">Dreads courtes 2</option>
              <option value="ShortHairFrizzle">Frisottés</option>
              <option value="ShortHairShaggyMullet">Mullet</option>
              <option value="ShortHairShortCurly">Bouclés courts</option>
              <option value="ShortHairShortFlat">Plats courts</option>
              <option value="ShortHairShortRound">Courts ronds</option>
              <option value="ShortHairShortWaved">Courts ondulés</option>
              <option value="ShortHairSides">Sur les côtés</option>
              <option value="ShortHairTheCaesar">César</option>
              <option value="ShortHairTheCaesarSidePart">César avec raie</option>
            </optgroup>
            <optgroup label="Autres">
              <option value="Eyepatch">Cache-œil</option>
              <option value="Hat">Casquette</option>
              <option value="Hijab">Hijab</option>
              <option value="Turban">Turban</option>
              <option value="WinterHat1">Bonnet 1</option>
              <option value="WinterHat2">Bonnet 2</option>
              <option value="WinterHat3">Bonnet 3</option>
              <option value="WinterHat4">Bonnet 4</option>
              <option value="NoHair">Chauve</option>
            </optgroup>
          </select>
        </label>

        <label style={styles.label}>
          <span style={styles.labelText}>Couleur cheveux</span>
          <select
            onChange={(e) => handleChange("hairColor", e.target.value)}
            value={avatarConfig.hairColor}
            style={styles.select}
          >
            <option value="BrownDark">Brun foncé</option>
            <option value="Brown">Brun</option>
            <option value="Blonde">Blond</option>
            <option value="BlondeGolden">Blond doré</option>
            <option value="Black">Noir</option>
            <option value="Red">Roux</option>
            <option value="Auburn">Auburn</option>
          </select>
        </label>

        <label style={styles.label}>
          <span style={styles.labelText}>Vêtements</span>
          <select
            onChange={(e) => handleChange("clotheType", e.target.value)}
            value={avatarConfig.clotheType}
            style={styles.select}
          >
            <option value="BlazerShirt">Costume chemise</option>
            <option value="BlazerSweater">Costume pull</option>
            <option value="CollarSweater">Pull col</option>
            <option value="GraphicShirt">T-shirt graphique</option>
            <option value="Hoodie">Sweat à capuche</option>
            <option value="Overall">Salopette</option>
            <option value="ShirtCrewNeck">T-shirt classique</option>
            <option value="ShirtScoopNeck">T-shirt col rond</option>
            <option value="ShirtVNeck">T-shirt col V</option>
          </select>
        </label>

        <label style={styles.label}>
          <span style={styles.labelText}>Yeux</span>
          <select
            onChange={(e) => handleChange("eyeType", e.target.value)}
            value={avatarConfig.eyeType}
            style={styles.select}
          >
            <option value="Default">Normal</option>
            <option value="Close">Fermés</option>
            <option value="Cry">Ému</option>
            <option value="Dizzy">Étourdi</option>
            <option value="EyeRoll">Roulement d'yeux</option>
            <option value="Happy">Heureux</option>
            <option value="Hearts">Cœurs</option>
            <option value="Side">De côté</option>
            <option value="Squint">Plissés</option>
            <option value="Surprised">Surpris</option>
            <option value="Wink">Clin d'œil</option>
            <option value="WinkWacky">Clin d'œil espiègle</option>
          </select>
        </label>

        <label style={styles.label}>
          <span style={styles.labelText}>Bouche</span>
          <select
            onChange={(e) => handleChange("mouthType", e.target.value)}
            value={avatarConfig.mouthType}
            style={styles.select}
          >
            <option value="Smile">Sourire</option>
            <option value="Default">Normal</option>
            <option value="Concerned">Préoccupé</option>
            <option value="Disbelief">Incrédule</option>
            <option value="Eating">En train de manger</option>
            <option value="Grimace">Grimace</option>
            <option value="Sad">Triste</option>
            <option value="ScreamOpen">Cri</option>
            <option value="Serious">Sérieux</option>
            <option value="Tongue">Langue</option>
            <option value="Twinkle">Malicieux</option>
            <option value="Vomit">Dégoûté</option>
          </select>
        </label>

        <label style={styles.label}>
          <span style={styles.labelText}>Teint</span>
          <select
            onChange={(e) => handleChange("skinColor", e.target.value)}
            value={avatarConfig.skinColor}
            style={styles.select}
          >
            <option value="Light">Clair</option>
            <option value="Pale">Pâle</option>
            <option value="Tanned">Hâlé</option>
            <option value="Yellow">Jaune</option>
            <option value="Brown">Brun</option>
            <option value="DarkBrown">Foncé</option>
            <option value="Black">Noir</option>
          </select>
        </label>

        <label style={styles.label}>
          <span style={styles.labelText}>Accessoires</span>
          <select
            onChange={(e) => handleChange("accessoriesType", e.target.value)}
            value={avatarConfig.accessoriesType}
            style={styles.select}
          >
            <option value="Blank">Aucun</option>
            <option value="Kurt">Style Kurt</option>
            <option value="Prescription01">Lunettes de vue</option>
            <option value="Prescription02">Lunettes de vue 2</option>
            <option value="Round">Lunettes rondes</option>
            <option value="Sunglasses">Lunettes de soleil</option>
            <option value="Wayfarers">Lunettes carrées</option>
          </select>
        </label>

        {gender !== "femme" && (
          <label style={styles.label}>
            <span style={styles.labelText}>Barbe / Moustache</span>
            <select
              onChange={(e) => handleChange("facialHairType", e.target.value)}
              value={avatarConfig.facialHairType}
              style={styles.select}
            >
              <option value="Blank">Aucune</option>
              <option value="BeardLight">Barbe légère</option>
              <option value="BeardMajestic">Barbe majestueuse</option>
              <option value="BeardMedium">Barbe moyenne</option>
              <option value="MoustacheFancy">Moustache élégante</option>
              <option value="MoustacheMagnum">Moustache Magnum</option>
            </select>
          </label>
        )}
      </div>

      <button style={styles.saveButton} onClick={handleSave}>
        Valider cet avatar ✨
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #333",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 20px 0",
  },
  genderSelector: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
  },
  genderButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#1a1a1a",
    border: "2px solid #333",
    borderRadius: "10px",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  genderButtonActive: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
    transform: "scale(1.05)",
  },
  avatarWrapper: {
    backgroundColor: "#1a1a1a",
    borderRadius: "50%",
    padding: "20px",
    marginBottom: "20px",
    display: "inline-block",
    border: "2px solid #667eea",
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
    margin: "20px 0",
    textAlign: "left",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  labelText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#ccc",
  },
  select: {
    padding: "12px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },
  saveButton: {
    marginTop: "20px",
    backgroundColor: "linear-gradient(135deg, #667eea, #764ba2)",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    padding: "16px 24px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "16px",
    color: "white",
    cursor: "pointer",
    width: "100%",
  },
};

export default AvatarCreator;
