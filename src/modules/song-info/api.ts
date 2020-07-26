import { PlugMedia } from "../../lib/PlugAPI";

interface MediaInfo {
  title: string,
  artist: string,
  album: string,
  gender: string[],
  year: string
}

function normalizeTitle (media: PlugMedia) {
  return media.title.replace(/\((?:official)\s*(?:music|audio)\s*(?:video)\)/gmi, '')
}

export async function getInfo(media: PlugMedia): Promise<MediaInfo> {
  const title = normalizeTitle(media);
  return fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=b25b959554ed76058ac220b7b2e0a026&artist=${media.author}&track=${title}`)
    .then(res => res.text())
    .then(text => new window.DOMParser().parseFromString(text, 'text/xml'))
    .then(xml => ({
      title: xml.querySelector('track > name').textContent,
      artist: xml.querySelector('artist > name').textContent,
      album: xml.querySelector('album > title').textContent,
      gender: Array.from(xml.querySelectorAll('toptags > tag > name')).map(e => e.textContent),
      year: 'Indeterminado'
    }))
    .catch(() => null)
}

export async function getLyrics(media: PlugMedia) {
  const title = normalizeTitle(media);

  return fetch(`https://api.vagalume.com.br/search.php?apikey=660a4395f992ff67786584e238f501aa&art=${media.author}&mus=${title}`)
    .then(res => res.json())
    .then(json => json.mus && json.mus[0].url)
}