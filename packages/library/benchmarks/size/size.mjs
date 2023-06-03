import { execSync } from "child_process"

export function countKilobytes(cmd) {
  const result = execSync(`${cmd} | wc -c`, { shell: true })
  return parseInt(result.toString().trim(), 10) / 1024
}

export function gzipSize(file) {
  return countKilobytes(`gzip -c '${file}'`)
}

export function fileSize(file) {
  return countKilobytes(`cat '${file}'`)
}
