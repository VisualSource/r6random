import { readdirSync, renameSync, writeFileSync } from "node:fs"
/*const path = "C:\\Users\\Collin\\Downloads\\"
const re = "undefined"
for (const file of readdirSync(path)){
    console.log(file,file.endsWith(".webp") && file.includes(re))
    if (file.endsWith(".webp") && file.includes(re)) {
        const og = file.replace(re,"").toLowerCase()
        console.log(`${path}${og}`)
        renameSync(`${path}${file}`,`${path}${og}`)
    }
}*/


const path = "./public/weapons"
const data = {}
for (const file of readdirSync(path)){
    const weapon = file.replace(".webp","")
    data[weapon] = { }
}

writeFileSync("./src/assets/weapons.json",JSON.stringify(data))

