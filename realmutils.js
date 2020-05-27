
exports.placementColor = p => (
	(p === 1) ? '#FFD700' :
	(p === 2) ? '#C0C0C0' :
	(p === 3) ? '#CD7F32' :
	(p <= 10) ? '#0000C0' : '#C00000');

exports.kd = (k, d) => ((d === 0) ? '\u221E' : (k/d).toFixed(2));

exports.dpk = (d, k) => ((k === 0) ? '\u221E' : (d/k).toFixed(2));
