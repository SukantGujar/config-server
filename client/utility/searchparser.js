module.exports = (search = "?")=>search.substr(1).split('&').map(item=>item.split('=')).reduce((prev, [key, value])=>{prev[key] = value; return prev},{});
