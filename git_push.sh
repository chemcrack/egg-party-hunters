echo off
git add .
git commit -m "1"
git push
case "$OSTYPE" in
  darwin*)
    echo "==========  退出[Enter]  =========="
    ;;
  *)
    echo -e "\e[5;92m==========  退出[Enter]  ==========\e[0m"
    read -n 1 -p ""
    exit 0
    ;;
esac