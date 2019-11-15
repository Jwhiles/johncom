mkdir dist/posts

for file in posts/*.md; do
  echo $file
  sed '/\+\+\+/,/\+\+\+/d' $file > dist/"$file"

done

