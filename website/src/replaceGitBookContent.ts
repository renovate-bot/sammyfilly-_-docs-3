type ReplaceGitBookContentParams = {
  content: string
  user: string
  repo: string
  branch: string
  docsPath: string
}

export function replaceGitBookContent({ content, user, repo, branch, docsPath }: ReplaceGitBookContentParams): string {
  return (
    content
      // replace {% embed ... %} with <iframe />
      .replaceAll(
        /{%\s+embed\s+url="(.*?)"\s+%}/g,
        (...m) =>
          `<iframe src="${m[1].replace(
            // we need to enhance YouTube links, otherwise they will be not loaded in iframe
            'youtube.com/watch?v=',
            'youtube.com/embed/'
          )}" style={{ aspectRatio: 16/9, width: '100%' }} />`
      )
      // remove gitbook {% ... %} elements
      .replaceAll(/{%.*?%}/g, '')
      // close unclosed img tags
      .replaceAll(/<img((?:(?!\/>)[^>])*?)>/g, (...m) => `<img${m[1]}/>`)
      // Replaces all the relative paths of images to absolute paths to the repo
      .replaceAll('../assets', `https://raw.githubusercontent.com/${user}/${repo}/${branch}/assets/`)
      .replaceAll(
        '.gitbook/assets/',
        `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${docsPath}.gitbook/assets/`
      )
  )
}
