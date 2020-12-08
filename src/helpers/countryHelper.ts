export default function enhanceCountries(countries: any) {
    if (countries == null || countries === undefined) return [];

    return countries.map(country => ({
        key: country.code,
        label: country.name
    }));
}