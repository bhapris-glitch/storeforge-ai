// ==============================================================
// Layboka AI 
// storeforge-ai/backend/src/modules/themes/section.service.js
// ==============================================================
const Section = require("./section.model");
const Theme = require("./theme.model");

/*
|--------------------------------------------------------------------------
| Create Section
|--------------------------------------------------------------------------
*/

const createSection = async ({
  themeId,
  userId,
  storeId,
  name,
  type,
  title = "",
  subtitle = "",
  description = "",
  settings = {},
  styles = {}
}) => {

  const theme = await Theme.findOne({
    _id: themeId,
    userId
  });

  if (!theme) {
    throw new Error("Theme not found");
  }

  const lastSection =
    await Section.findOne({
      themeId
    }).sort({
      order: -1
    });

  const order =
    lastSection
      ? lastSection.order + 1
      : 1;

  const section =
    await Section.create({
      themeId,
      userId,
      storeId,
      sectionId:
        `section_${Date.now()}`,
      name,
      type,
      title,
      subtitle,
      description,
      settings,
      styles,
      order
    });

  theme.sections.push(
    section._id
  );

  await theme.save();

  return section;
};

/*
|--------------------------------------------------------------------------
| Get Theme Sections
|--------------------------------------------------------------------------
*/

const getThemeSections =
  async (
    themeId,
    userId
  ) => {

    return await Section.find({
      themeId,
      userId,
      status: {
        $ne: "archived"
      }
    }).sort({
      order: 1
    });

  };

/*
|--------------------------------------------------------------------------
| Get Section
|--------------------------------------------------------------------------
*/

const getSectionById =
  async (
    sectionId,
    userId
  ) => {

    const section =
      await Section.findOne({
        _id: sectionId,
        userId
      });

    if (!section) {
      throw new Error(
        "Section not found"
      );
    }

    return section;
  };

/*
|--------------------------------------------------------------------------
| Update Section
|--------------------------------------------------------------------------
*/

const updateSection =
  async (
    sectionId,
    userId,
    data
  ) => {

    const section =
      await Section.findOneAndUpdate(
        {
          _id: sectionId,
          userId
        },
        data,
        {
          new: true,
          runValidators: true
        }
      );

    if (!section) {
      throw new Error(
        "Section not found"
      );
    }

    return section;
  };

/*
|--------------------------------------------------------------------------
| Delete Section
|--------------------------------------------------------------------------
*/

const deleteSection =
  async (
    sectionId,
    userId
  ) => {

    const section =
      await getSectionById(
        sectionId,
        userId
      );

    await Theme.updateOne(
      {
        _id: section.themeId
      },
      {
        $pull: {
          sections:
            section._id
        }
      }
    );

    await Section.deleteOne({
      _id: sectionId
    });

    return true;
  };

/*
|--------------------------------------------------------------------------
| Duplicate Section
|--------------------------------------------------------------------------
*/

const duplicateSection =
  async (
    sectionId,
    userId
  ) => {

    const section =
      await getSectionById(
        sectionId,
        userId
      );

    const copy =
      section.toObject();

    delete copy._id;

    delete copy.createdAt;

    delete copy.updatedAt;

    copy.sectionId =
      `section_${Date.now()}`;

    copy.name =
      `${section.name} Copy`;

    copy.order =
      section.order + 1;

    const newSection =
      await Section.create(
        copy
      );

    await Theme.updateOne(
      {
        _id: section.themeId
      },
      {
        $push: {
          sections:
            newSection._id
        }
      }
    );

    return newSection;
  };

/*
|--------------------------------------------------------------------------
| Reorder Sections
|--------------------------------------------------------------------------
|
| sections = [
|   { id, order }
| ]
|
*/

const reorderSections =
  async (
    userId,
    sections
  ) => {

    for (const item of sections) {

      await Section.updateOne(
        {
          _id: item.id,
          userId
        },
        {
          order:
            item.order
        }
      );

    }

    return true;
  };

/*
|--------------------------------------------------------------------------
| Toggle Visibility
|--------------------------------------------------------------------------
*/

const toggleVisibility =
  async (
    sectionId,
    userId
  ) => {

    const section =
      await getSectionById(
        sectionId,
        userId
      );

    section.visible =
      !section.visible;

    await section.save();

    return section;
  };

/*
|--------------------------------------------------------------------------
| Lock / Unlock
|--------------------------------------------------------------------------
*/

const toggleLock =
  async (
    sectionId,
    userId
  ) => {

    const section =
      await getSectionById(
        sectionId,
        userId
      );

    section.locked =
      !section.locked;

    await section.save();

    return section;
  };

/*
|--------------------------------------------------------------------------
| Add Block
|--------------------------------------------------------------------------
*/

const addBlock =
  async (
    sectionId,
    userId,
    block
  ) => {

    const section =
      await getSectionById(
        sectionId,
        userId
      );

    section.blocks.push({
      blockId:
        `block_${Date.now()}`,
      type:
        block.type,
      title:
        block.title || "",
      settings:
        block.settings || {},
      order:
        section.blocks.length + 1
    });

    await section.save();

    return section;
  };

/*
|--------------------------------------------------------------------------
| Update Block
|--------------------------------------------------------------------------
*/

const updateBlock =
  async (
    sectionId,
    userId,
    blockId,
    data
  ) => {

    const section =
      await getSectionById(
        sectionId,
        userId
      );

    const block =
      section.blocks.find(
        b =>
          b.blockId ===
          blockId
      );

    if (!block) {
      throw new Error(
        "Block not found"
      );
    }

    Object.assign(
      block,
      data
    );

    await section.save();

    return section;
  };

/*
|--------------------------------------------------------------------------
| Delete Block
|--------------------------------------------------------------------------
*/

const deleteBlock =
  async (
    sectionId,
    userId,
    blockId
  ) => {

    const section =
      await getSectionById(
        sectionId,
        userId
      );

    section.blocks =
      section.blocks.filter(
        b =>
          b.blockId !==
          blockId
      );

    await section.save();

    return section;
  };

/*
|--------------------------------------------------------------------------
| AI Generate Section
|--------------------------------------------------------------------------
|
| Placeholder
|
*/

const generateAISection =
  async (
    sectionId,
    userId,
    prompt
  ) => {

    const section =
      await getSectionById(
        sectionId,
        userId
      );

    section.aiGenerated =
      true;

    section.aiPrompt =
      prompt;

    await section.save();

    return section;
  };

module.exports = {

  createSection,

  getThemeSections,

  getSectionById,

  updateSection,

  deleteSection,

  duplicateSection,

  reorderSections,

  toggleVisibility,

  toggleLock,

  addBlock,

  updateBlock,

  deleteBlock,

  generateAISection

};
