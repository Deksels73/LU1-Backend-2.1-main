import { AdviesRepository } from "../repositories/advies.repository.js";
import { BookRepository } from "../repositories/boek.repository.js";
function matchNiveau(niveau) {
    if (niveau === "F2-F3")
        return ["2F-3F", "F2", "F3"];
    if (niveau === "F2")
        return ["2F"];
    if (niveau === "F3")
        return ["3F"];
    if (niveau === "F3+")
        return ["3F+"];
    return [niveau];
}
const themaMapping = {
    historisch: [
        "oorlog", "verlies", "onderduik", "familie", "herinneringen",
        "biografie", "moraal", "cultuur", "recht", "burgerschap"
    ],
    avontuur: [
        "doorzetten", "veerkracht", "reizen", "cultuur", "ontwikkeling",
        "onderzoek", "mysterie", "spannning", "ervaringen"
    ],
    WOII: [
        "oorlog", "onderduik", "verlies", "familie", "moraal",
        "schuld", "herinneringen", "biografie"
    ],
    detective: [
        "mysterie", "thriller", "onderzoek", "criminaliteit", "geheimen",
        "bedrog", "spannning", "jongeren"
    ],
    welzijn: [
        "geluk", "zingeving", "zelfreflectie", "inzicht", "hoop",
        "verlies", "rouw", "zorg", "welzijn"
    ],
    vriendschap: [
        "vriendschap", "verbondenheid", "ontwikkeling", "opgroeien",
        "veerkracht", "ervaringen", "groei", "relaties"
    ],
    liefde: [
        "liefde", "verlies", "familie", "relaties", "groei",
        "ziekte", "hoop", "verbondenheid"
    ],
    spanning: [
        "spannning", "thriller", "mysterie", "geheimen",
        "bedrog", "onderzoek", "criminaliteit"
    ],
    migratie: [
        "migratie", "verlies", "cultuur", "herinneringen",
        "doorzetten", "veerkracht", "familie"
    ],
    filosofie: [
        "zingeving", "inzicht", "zelfreflectie", "moraal",
        "burgerschap", "samenleven"
    ],
    humor: [
        "humor", "ervaringen", "familie", "eten",
        "herinneringen", "groei"
    ],
    sport: [
        "sport", "doorzetten", "veerkracht", "groei",
        "vriendschap", "ontwikkeling"
    ],
    mysterie: [
        "mysterie", "onderzoek", "geheimen", "bedrog",
        "spannning", "thriller"
    ],
    familie: [
        "familie", "zorg", "herinneringen", "verlies",
        "groei", "relaties", "verbondenheid"
    ],
    identiteit: [
        "identiteit", "zelfreflectie", "ontwikkeling",
        "groei", "gender", "samenleven"
    ],
    macht: [
        "macht", "gender", "groepsdruk", "samenleven",
        "moraal", "criminaliteit"
    ],
    jongeren: [
        "jongeren", "opgroeien", "groepsdruk", "vriendschap",
        "ontwikkeling", "ervaringen"
    ]
};
export const AdviesService = {
    async genereerAdvies(studentId) {
        const profiel = await AdviesRepository.getProfiel(studentId);
        if (!profiel)
            return { error: "Geen leesprofiel gevonden", status: 404 };
        const genre = JSON.parse(profiel.genre);
        const onderwerp = JSON.parse(profiel.onderwerp);
        const thema = [...genre, ...onderwerp];
        const mappedThema = thema.flatMap(t => themaMapping[t] || []);
        // 1. Basisfilter: type + niveau
        const baseFilters = {
            "Type materiaal": { $regex: "^Boek", $options: "i" },
            Niveau: { $in: matchNiveau(profiel.taalniveau) }
        };
        const alleBoeken = await BookRepository.getFiltered(baseFilters);
        // 2. Thema-matching
        const themaBoeken = alleBoeken.filter(book => mappedThema.some(t => book.Themas_boek?.toLowerCase().includes(t.toLowerCase())));
        const uniqueBoeken = [
            ...new Map([...themaBoeken, ...alleBoeken].map(book => [book._id.toString(), book])).values()
        ];
        // 3. Altijd 3 boeken teruggeven
        const top3 = uniqueBoeken.slice(0, 3);
        // 4. Volledige boekdata ophalen
        const advies = await Promise.all(top3.map(async (book) => {
            const fullBook = await BookRepository.getById(book._id.toString());
            return {
                bookId: book._id.toString(), // voor opslaan in DB
                book: fullBook, // voor teruggeven aan frontend
                reason: `Dit boek past bij jouw taalniveau (${profiel.taalniveau}) en jouw thema's (${thema.join(", ")}).`
            };
        }));
        await AdviesRepository.deleteAdvies(studentId);
        // 5. Opslaan in database (correct)
        await AdviesRepository.saveAdvies(studentId, advies.map(a => ({
            bookId: a.bookId,
            reason: a.reason
        })));
        // 6. Teruggeven aan frontend
        return { advies };
    }
};
//# sourceMappingURL=advies.service.js.map