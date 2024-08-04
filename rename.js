import { readdirSync, renameSync } from "node:fs"
const path = "C:\\Users\\Collin\\Downloads\\"
const re = "undefined"
for (const file of readdirSync(path)){
    console.log(file,file.endsWith(".webp") && file.includes(re))
    if (file.endsWith(".webp") && file.includes(re)) {
        const og = file.replace(re,"").toLowerCase()
        console.log(`${path}${og}`)
        renameSync(`${path}${file}`,`${path}${og}`)
    }
}