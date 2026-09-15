import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Glasses, Headphones, Shirt, Smile } from "lucide-react";
import Bee3D from "./Bee3D";

const CHARACTERS = {
  flor: {
    name: "Abelha Flor",
    role: "Personagem menina",
    tagline: "Sonha, cria, une",
    looks: [["classico", "Clássico"], ["esportivo", "Esportivo"], ["inverno", "Inverno"], ["urbano", "Urbano"]],
    accessories: [["", "Sem acessório"], ["oculos", "Óculos"], ["flor", "Flor no cabelo"], ["bolsa", "Bolsa Colmeia"]],
  },
  hatch: {
    name: "Hatch",
    role: "Personagem menino",
    tagline: "Explora, resolve, constrói",
    looks: [["classico", "Clássico"], ["esportivo", "Esportivo"], ["inverno", "Inverno"], ["urbano", "Urbano"]],
    accessories: [["", "Sem acessório"], ["oculos", "Óculos"], ["fone", "Fone"], ["mochila", "Mochila"]],
  },
};

const EXPRESSIONS = [["feliz", "Feliz"], ["surpresa", "Surpresa"], ["determinada", "Determinação"], ["pensativa", "Pensativa"], ["risonha", "Risonha"]];

export default function AvatarStudio({ profile, onChange }) {
  const startX = useRef(null);
  const equipped = profile.equipped || {};
  const selected = equipped.personagem === "hatch" ? "hatch" : "flor";
  const character = CHARACTERS[selected];

  function update(changes) {
    onChange({ ...profile, equipped: { ...equipped, ...changes } });
  }

  function choose(next) {
    update({ personagem: next, look: "classico", expressao: "feliz", acessorio: "", roupa: "", chapeu: "", saia: "" });
  }

  function changeCharacter(direction) {
    choose(direction > 0 ? (selected === "flor" ? "hatch" : "flor") : (selected === "hatch" ? "flor" : "hatch"));
  }

  return (
    <section className="co-avatar-studio" aria-label="Personalizar Minha Abelha">
      <div
        className="co-character-stage"
        onPointerDown={(event) => { startX.current = event.clientX; }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const distance = event.clientX - startX.current;
          if (Math.abs(distance) > 42) changeCharacter(distance < 0 ? 1 : -1);
          startX.current = null;
        }}
        onPointerCancel={() => { startX.current = null; }}
      >
        <button className="co-character-arrow is-left" aria-label="Ver personagem anterior" onClick={() => changeCharacter(-1)}><ChevronLeft size={22} /></button>
        <div className="co-character-copy"><span>{character.role}</span><strong>{character.name}</strong><small>{character.tagline}</small></div>
        <Bee3D size={248} equipped={equipped} variant={selected} expression={equipped.expressao || "feliz"} />
        <button className="co-character-arrow is-right" aria-label="Ver próximo personagem" onClick={() => changeCharacter(1)}><ChevronRight size={22} /></button>
        <p className="co-swipe-hint">Deslize para escolher Flor ou Hatch</p>
      </div>

      <div className="co-character-dots" aria-label="Personagem selecionado">
        {Object.entries(CHARACTERS).map(([id, item]) => <button key={id} aria-pressed={selected === id} onClick={() => choose(id)}>{item.name}</button>)}
      </div>

      <ChoiceGroup Icon={Shirt} title="Look" options={character.looks} value={equipped.look || "classico"} onSelect={(look) => update({ look })} />
      <ChoiceGroup Icon={Smile} title="Expressão" options={EXPRESSIONS} value={equipped.expressao || "feliz"} onSelect={(expressao) => update({ expressao })} />
      <ChoiceGroup Icon={selected === "hatch" ? Headphones : Glasses} title="Acessório" options={character.accessories} value={equipped.acessorio || ""} onSelect={(acessorio) => update({ acessorio })} />
    </section>
  );
}

function ChoiceGroup({ Icon, title, options, value, onSelect }) {
  return <fieldset className="co-avatar-options"><legend><Icon size={15} /> {title}</legend><div>{options.map(([id, label]) => <button type="button" key={id || "none"} aria-pressed={value === id} onClick={() => onSelect(id)}>{label}</button>)}</div></fieldset>;
}
