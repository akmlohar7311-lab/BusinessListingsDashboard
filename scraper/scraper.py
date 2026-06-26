from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import TimeoutException
import csv
import time

# Categories to scrape
categories = [
    ("restaurants", "Restaurant"),
    ("gyms", "Gym"),
    ("salons", "Salon"),
    ("supermarkets", "Supermarket"),
]

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 15)
driver.maximize_window()

with open("businesses.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    writer.writerow([
        "Business Name",
        "Category",
        "City",
        "Address",
        "Phone",
        "Source"
    ])

    for slug, category in categories:

        print(f"\nScraping {category}...\n")

        driver.get(f"https://www.sulekha.com/{slug}/mumbai")

        time.sleep(8)

        # Click View More repeatedly
        for i in range(20):
            try:
                view_more = wait.until(
                    EC.element_to_be_clickable((By.ID, "listings-view-more"))
                )

                driver.execute_script("arguments[0].scrollIntoView();", view_more)
                time.sleep(2)
                driver.execute_script("arguments[0].click();", view_more)

                print(f"{category}: View More {i+1}")

                time.sleep(4)

            except TimeoutException:
                print(f"{category}: Finished loading")
                break

        names = driver.find_elements(By.TAG_NAME, "h3")
        addresses = driver.find_elements(By.TAG_NAME, "address")
        phones = driver.find_elements(By.CSS_SELECTOR, "a[href^='tel:']")

        print(f"{category}: {len(names)} businesses")

        for i in range(len(names)):
            business = names[i].text.strip()
            address = addresses[i].text.strip() if i < len(addresses) else ""
            phone = phones[i].text.strip() if i < len(phones) else ""

            writer.writerow([
                business,
                category,
                "Mumbai",
                address,
                phone,
                "Sulekha"
            ])

print("\nCSV Created Successfully!")

input("Press Enter to close...")

driver.quit()