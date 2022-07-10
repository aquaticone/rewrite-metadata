const fs = require("fs/promises")
const path = require("path")

const yargs = require("yargs/yargs")
const { hideBin } = require("yargs/helpers")

yargs(hideBin(process.argv))
  .command(
    "$0 <metadataPath>",
    "swap filenames of two files",
    async (yargs) => {
      return yargs
        .option("uriPrefix", {
          describe: "value to prefix all image values with",
          type: "string",
        })
        .demandOption(["uriPrefix"])
        .positional("metadataPath", {
          describe: "Path where token metadata files live",
          type: "string",
        })
    },
    async ({ metadataPath, uriPrefix }) => {
      try {
        const absPath = path.resolve(metadataPath)
        const files = await fs.readdir(absPath)

        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const filePath = `${absPath}/${file}`
          const fileContents = JSON.parse(await fs.readFile(filePath))
          const newFileContents = {
            ...fileContents,
            image: `${uriPrefix}/${fileContents.image}`,
          }
          await fs.writeFile(filePath, JSON.stringify(newFileContents))
        }

        console.log("Metadata successfully rewritten")
      } catch (err) {
        console.error(err)
      }
    }
  )
  .parse()
