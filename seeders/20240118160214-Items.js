'use strict';

const { getFormattedDate } = require('../utils/date');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert(
       "Items",
       [
         {
           item_name: "Motor Yamaha N-Max",
           item_image:
             "https://www.yamaha-motor.co.id/uploads/products/new_product_model_image/202202151255313503V70891.png",
           item_description:
             "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto magnam ad quos provident impedit. Deserunt asperiores, nulla, in ipsa libero tenetur magnam eum harum nihil repudiandae, expedita doloribus inventore sed.",
           item_stock: "201",
           item_price: "32000000",
           created_at: getFormattedDate(),
           updated_at: getFormattedDate(),
         },
         {
           item_name: "Motor Honda PCX",
           item_image:
             "https://gallery.poskota.co.id/storage/Foto/Foto_20230716_111017_nyD.jpeg",
           item_description:
             "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto magnam ad quos provident impedit. Deserunt asperiores, nulla, in ipsa libero tenetur magnam eum harum nihil repudiandae, expedita doloribus inventore sed.",
           item_stock: "90",
           item_price: "30000000",
           created_at: getFormattedDate(),
           updated_at: getFormattedDate(),
         },
         {
           item_name: "Motor Honda Scoopy",
           item_image:
             "https://otoinfo.id/wp-content/uploads/2023/10/imresizer-1697290722717.jpg",
           item_description:
             "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto magnam ad quos provident impedit. Deserunt asperiores, nulla, in ipsa libero tenetur magnam eum harum nihil repudiandae, expedita doloribus inventore sed.",
           item_stock: "40",
           item_price: "20000000",
           created_at: getFormattedDate(),
           updated_at: getFormattedDate(),
         },
         {
           item_name: "Motor Vespa Sprint",
           item_image:
             "https://images.bisnis.com/posts/2019/04/24/915229/sprint_notte.jpg",
           item_description:
             "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto magnam ad quos provident impedit. Deserunt asperiores, nulla, in ipsa libero tenetur magnam eum harum nihil repudiandae, expedita doloribus inventore sed.",
           item_stock: "100",
           item_price: "50000000",
           created_at: getFormattedDate(),
           updated_at: getFormattedDate(),
         },
       ],
       {}
     );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
