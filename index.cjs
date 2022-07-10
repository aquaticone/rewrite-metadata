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
      } catch (err) {}

      // if (!metadataPath) {
      //   console.error("You must provide two file paths to swap")
      //   return
      // }
      // if (!pathA.includes("/") || !pathB.includes("/")) {
      //   console.error("File paths must include a slash")
      //   return
      // }
      // try {
      //   const absPathA = path.resolve(pathA)
      //   const absPathB = path.resolve(pathB)
      //   const filenameA = path.basename(absPathA)
      //   const filenameB = path.basename(absPathB)
      //   // copy to temp directory first to make sure both files exist
      //   const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "swap-files-"))
      //   const tempNewA = `${tempDir}/${filenameA}`
      //   const tempNewB = `${tempDir}/${filenameB}`
      //   await fs.copyFile(absPathA, tempNewA)
      //   await fs.copyFile(absPathB, tempNewB)
      //   // copy back to original directory with names swapped
      //   await fs.copyFile(tempNewA, absPathB)
      //   await fs.copyFile(tempNewB, absPathA)
      //   console.log("Filenames swapped successfully")
      // } catch (err) {
      //   console.error(err)
      // }
    }
  )
  .parse()
