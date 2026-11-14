export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function validateBooking(data, today = localDate()) {
  if (!['transport','repair'].includes(data.service)) return 'Valitse ensin palvelu.';
  if (data.service === 'transport') {
    if (!data.items.length && !data.other.trim()) return 'Valitse vähintään yksi tavara tai kuvaile muu kuorma.';
    if (!data.from.trim() || !data.to.trim()) return 'Kirjoita lähtö- ja määränpään osoite.';
    if (!data.points.from || !data.points.to) return 'Merkitse lähtö ja määränpää kartalle.';
  } else if (data.description.trim().length < 10) return 'Kuvaile työtä vähintään 10 merkillä.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || data.date < today || localDate(new Date(`${data.date}T12:00:00`)) !== data.date) return 'Valitse tämä päivä tai tuleva päivä.';
  if (![1,2,3,4,6,8].includes(Number(data.duration))) return 'Valitse arvio työn kestosta.';
  return '';
}
export function bookingText(data) {
  const date = new Intl.DateTimeFormat('fi-FI',{dateStyle:'long'}).format(new Date(`${data.date}T12:00:00`));
  const details = data.service === 'transport'
    ? `Tavarat: ${[...data.items, data.other.trim()].filter(Boolean).join(', ')}\nLähtö: ${data.from}\nMääränpää: ${data.to}\nKarttapisteet: ${data.points.from.join(', ')} → ${data.points.to.join(', ')}`
    : `Työn kuvaus: ${data.description}`;
  return `JaaS · Varausluonnos\n${data.service === 'transport' ? 'Kuljetuspalvelu' : 'Yleisremonttiapulainen'}\n${details}\nPäivä: ${date}\nArvioitu kesto: ${data.duration} h\n\nKonseptiluonnos. Varausta ei ole lähetetty tai vahvistettu.`;
}
