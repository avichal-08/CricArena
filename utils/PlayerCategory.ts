export const getPlayerCategory = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('bat')) return 'BAT';
    if (r.includes('bowl')) return 'BOWL';
    if (r.includes('wk') || r.includes('wicket')) return 'WK';
    if (r.includes('all') || r === 'ar') return 'AR';
    return 'OTHER';
};