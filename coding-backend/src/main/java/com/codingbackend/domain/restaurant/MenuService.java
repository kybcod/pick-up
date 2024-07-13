package com.codingbackend.domain.restaurant;

import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class MenuService {

    private final MenuMapper menuMapper;

        public List<Menu> getMenuList(Integer placeId) throws IOException {
            List<Menu> menuList = new ArrayList<>();
            String menu_url = "https://place.map.kakao.com/" + placeId;
            Document document = Jsoup.connect(menu_url).get();

            Elements contents = document.select("ul.list_menu li");

            for (Element content : contents) {
                Menu menu = Menu.builder()
                        .image(content.select("a.link_photo img").attr("abs:src")) // 메뉴 이미지
                        .name(content.select("span.loss_word").text()) // 메뉴 이름
                        .price(content.select("em.price_menu").text()) // 메뉴 가격
                        .build();
                menuList.add(menu);
            }
            return menuList;
        }
}