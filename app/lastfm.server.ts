const baseUrl = `http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks`;

export const getTopTracks = async (
  period: "7day",
  limit = 10,
): Promise<
  {
    name: string;
    artist: {
      name: string;
    };
    playcount: number;
    url: string;
  }[]
> => {
  const url = `${baseUrl}&user=${process.env.LASTFM_USER}&api_key=${process.env.LASTFM_API_KEY}&format=json&period=${period}&limit=${limit}`;
  const res = await fetch(url);
  return (await res.json()).toptracks.track;
};
